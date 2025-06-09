pipeline {
    agent any
    tools {
        dockerTool 'docker'
    }
    environment {
        IMAGENAME = 'web3-stores'
        OPENAI_API_KEY = credentials('OPENAI_API_KEY')
        NODE_ENV = 'production'
    }
    parameters {
        choice(name: 'BUILD_TYPE', choices: ['patch', 'minor', 'major'], description: 'Select version to build in develop')
        choice(name: 'NET', choices: ['testnet', 'stagenet', 'mainnet'], description: 'Select net type to build')
        choice(name: 'CLOUD', choices: ['GCP', 'AZURE', 'AWS'], description: 'Select cloud operator to push docker image')
    }
    stages {
        stage('GCP Release') {
            when {
                expression { return params.CLOUD == 'GCP' }
            }
            environment {
                INCREMENT_TYPE = "${params.BUILD_TYPE}"
                TAG = "${params.NET}"
                GCR = "asia-south1-docker.pkg.dev/prod-dojima/${params.NET}"
            }
            steps {
                script {
                    withCredentials([
                        sshUserPrivateKey(credentialsId: 'dojimanetwork', keyFileVariable: 'SSH_KEY'),
                        string(credentialsId: 'gcloud-access-token', variable: 'GCLOUD_ACCESS_TOKEN'),
                        string(credentialsId: 'ci-registry-user', variable: 'CI_REGISTRY_USER'),
                        string(credentialsId: 'ci-registry', variable: 'CI_REGISTRY'),
                        string(credentialsId: 'ci-pat', variable: 'CR_PAT')
                    ]) {
                        withEnv(["GIT_SSH_COMMAND=ssh -o StrictHostKeyChecking=no -i ${env.SSH_KEY}"]) {
                            echo "Selected action: ${INCREMENT_TYPE}, ${TAG}, ${GCR}"
                            sh 'gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://${GCR}'
                            
                            // Use Makefile for build and push
                            sh 'make docker-build docker-push'
                        }
                    }
                }
            }
        }

        stage('AZURE Release') {
            when {
                expression { return params.CLOUD == 'AZURE' }
            }
            environment {
                INCREMENT_TYPE = "${params.BUILD_TYPE}"
                AZURE = "${params.NET}.azurecr.io"
            }
            steps {
                script {
                    withCredentials([
                        sshUserPrivateKey(credentialsId: 'dojimanetwork', keyFileVariable: 'SSH_KEY'),
                        string(credentialsId: 'azure-stagenet-cr-token', variable: 'AZURE_STAGENET_ACCESS_TOKEN'),
                        string(credentialsId: 'azure-mainnet-cr-token', variable: 'AZURE_MAINNET_ACCESS_TOKEN'),
                        string(credentialsId: 'azure-testnet-cr-token', variable: 'AZURE_TESTNET_ACCESS_TOKEN'),
                        string(credentialsId: 'ci-registry-user', variable: 'CI_REGISTRY_USER'),
                        string(credentialsId: 'ci-registry', variable: 'CI_REGISTRY'),
                        string(credentialsId: 'ci-pat', variable: 'CR_PAT'),
                        string(credentialsId: 'DOCKER_HUB_CREDENTIALS_ID', variable: 'DOCKER_PASSWORD')
                    ]) {
                        withEnv(["GIT_SSH_COMMAND=ssh -o StrictHostKeyChecking=no -i ${env.SSH_KEY}"]) {
                            // Azure container registry login based on environment
                            if (params.NET == "stagenet") {
                                sh 'echo $AZURE_STAGENET_ACCESS_TOKEN | docker login -u stagenet --password-stdin $AZURE'
                            } else if (params.NET == "mainnet") {
                                sh 'echo $AZURE_MAINNET_ACCESS_TOKEN | docker login -u mainnet --password-stdin $AZURE'
                            } else if (params.NET == "testnet") {
                                env.AZURE = "${params.NET}1.azurecr.io"
                                sh 'echo $AZURE_TESTNET_ACCESS_TOKEN | docker login -u testnet1 --password-stdin $AZURE'
                            }

                            // Use Makefile for build and push
                            sh 'make release'

                            // Update ArgoCD manifests based on environment
                            if (params.NET == 'mainnet') {
                                updateArgoCD('prod')
                            } else if (params.NET == 'testnet') {
                                updateArgoCD('dev')
                            } else if (params.NET == 'stagenet') {
                                updateArgoCD('staging')
                            }
                        }
                    }
                }
            }
        }
    }
}

def updateArgoCD(String environment) {
    withCredentials([string(credentialsId: 'Gitops_PAT', variable: 'GIT_TOKEN')]) {
        sh """
            cd ${WORKSPACE}
            if [ -d "ArgoCD" ]; then
                rm -rf ArgoCD
            fi
            git clone https://${GIT_TOKEN}@github.com/dojimanetwork/ArgoCD.git
            cd ArgoCD/apps/web3-stores/overlays/${environment}
            /var/lib/jenkins/kustomize edit set image ${AZURE}/${IMAGENAME}:${TAG}
            git add .
            git commit -m "Update image ${AZURE}/${IMAGENAME} with ${TAG}"
            git push origin main
            cd ${WORKSPACE} && rm -r ArgoCD
        """
    }
} 