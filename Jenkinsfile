pipeline {
    agent any
    tools {
        dockerTool 'docker'
    }
    environment {
        IMAGENAME = 'web3-stores'
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
                            
                            // Build and push Docker image
                            sh """
                                docker build -t ${GCR}/${IMAGENAME}:${TAG} .
                                docker push ${GCR}/${IMAGENAME}:${TAG}
                            """
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
                            env.AZURE = "${params.NET}.azurecr.io"
                            def _azure = "${params.NET}.azurecr.io"
                            def _net = "${params.NET}"
                            env.TAG = "${params.NET}"

                            // Azure container registry login based on environment
                            if (params.NET == "stagenet") {
                                sh 'echo $AZURE_STAGENET_ACCESS_TOKEN | docker login -u stagenet --password-stdin $AZURE'
                            } else if (params.NET == "mainnet") {
                                sh 'echo $AZURE_MAINNET_ACCESS_TOKEN | docker login -u mainnet --password-stdin $AZURE'
                            } else if (params.NET == "testnet") {
                                _azure = "${params.NET}1.azurecr.io"
                                sh """
                                    echo $AZURE_TESTNET_ACCESS_TOKEN | docker login -u testnet1 --password-stdin $_azure
                                """
                            }

                            env.AZURE = _azure

                            // Build and push Docker image
                            sh """
                                docker build -t ${env.AZURE}/${IMAGENAME}:${env.TAG} .
                                docker push ${env.AZURE}/${IMAGENAME}:${env.TAG}
                            """

                            // Security scan with Trivy
                            sh """
                                trivy clean --scan-cache && trivy image --format table --exit-code 1 --ignore-unfixed --pkg-types os,library --severity CRITICAL,HIGH ${env.AZURE}/${IMAGENAME}:${env.TAG}
                            """

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