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
        choice(name: 'BUILD_TYPE', choices: ['patch', 'minor', 'major'], description: 'select version to build in develop')
        choice(name: 'NET', choices: ['testnet', 'stagenet', 'mainnet'], description: 'select net type to build')
        choice(name: 'CLOUD', choices: ['GCP', 'AZURE', 'AWS'], description: 'select cloud operator to push docker image')
    }
    stages {
        stage('GCP Release') {
            when {
                expression { return params.CLOUD == 'GCP' }
            }
            environment {
                INCREMENT_TYPE = "${params.BUILD_TYPE}"
                NET_TYPE = "${params.NET}"
                GCR = "asia-south1-docker.pkg.dev/prod-dojima/${params.NET}"
            }
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: 'dojimanetwork', keyFileVariable: 'SSH_KEY'),
                                      string(credentialsId: 'gcloud-access-token', variable: 'GCLOUD_ACCESS_TOKEN'),
                                      string(credentialsId: 'ci-registry-user', variable: 'CI_REGISTRY_USER'),
                                      string(credentialsId: 'ci-registry', variable: 'CI_REGISTRY'),
                                      string(credentialsId: 'ci-pat', variable: 'CR_PAT')]) {
                        withEnv(["GIT_SSH_COMMAND=ssh -o StrictHostKeyChecking=no -i ${env.SSH_KEY}"]) {
                            echo "Selected action: ${INCREMENT_TYPE}, ${NET_TYPE}, ${GCR}"
                            sh 'gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://${GCR}'
                            sh 'make release'
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
                NET_TYPE = "${params.NET}"
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
                            def azureRegistry = "${params.NET}.azurecr.io"
                            def azureUsername = "mainnet"
                            
                            if (params.NET == "stagenet") {
                                azureUsername = "stagenet"
                                sh 'echo $AZURE_STAGENET_ACCESS_TOKEN | docker login -u stagenet --password-stdin ${azureRegistry}'
                            } else if (params.NET == "mainnet") {
                                azureUsername = "mainnet"
                                sh 'echo $AZURE_MAINNET_ACCESS_TOKEN | docker login -u mainnet --password-stdin ${azureRegistry}'
                            } else if (params.NET == "testnet") {
                                azureRegistry = "${params.NET}1.azurecr.io"
                                azureUsername = "testnet1"
                                sh 'echo $AZURE_TESTNET_ACCESS_TOKEN | docker login -u testnet1 --password-stdin ${azureRegistry}'
                            }

                            // Run the release
                            sh "make azure-release AZURE=${azureRegistry} INCREMENT_TYPE=${params.BUILD_TYPE}"

                            // Capture environment variables from Makefile
                            def buildInfo = sh(script: "make print-vars INCREMENT_TYPE=${params.BUILD_TYPE}", returnStdout: true).trim().split('\n')
                            def envVars = [:]
                            buildInfo.each {
                                def (key, value) = it.split('=')
                                envVars[key.trim()] = value.trim()
                            }

                            // Set environment variables
                            env.GITREF = envVars['GITREF']
                            env.VERSION = envVars['VERSION']
                            env.IMAGETAG = "${env.GITREF}_${env.VERSION}"

                            echo "Captured GITREF: ${env.GITREF}"
                            echo "Captured VERSION: ${env.VERSION}"
                            echo "Image Tag: ${env.IMAGETAG}"

                            // Get image digest
                            def imageDigest = sh(
                                script: "docker inspect --format='{{index .RepoDigests 0}}' ${azureRegistry}/${IMAGENAME}:${env.IMAGETAG} | awk -F'@' '{print \$2}'",
                                returnStdout: true
                            ).trim().replaceAll(/^sha256:/, '')

                            echo "Image Digest: ${imageDigest}"

                            // Run security scan
                            sh """
                                trivy clean --scan-cache && trivy image --format table --exit-code 1 --ignore-unfixed --pkg-types os,library --severity CRITICAL,HIGH ${azureRegistry}/${IMAGENAME}:${env.IMAGETAG}
                            """

                            // Update ArgoCD based on network type
                            if (params.NET == 'mainnet') {
                                updateArgoCD('prod', azureRegistry, env.IMAGETAG)
                            } else if (params.NET == 'testnet') {
                                updateArgoCD('dev', azureRegistry, env.IMAGETAG)
                            } else if (params.NET == 'stagenet') {
                                updateArgoCD('staging', azureRegistry, env.IMAGETAG)
                            }
                        }
                    }
                }
            }
        }
    }
}

def updateArgoCD(String environment, String registry, String imageTag) {
    withCredentials([string(credentialsId: 'Gitops_PAT', variable: 'GIT_TOKEN')]) {
        sh """
            cd ${WORKSPACE}
            if [ -d "ArgoCD" ]; then
                rm -rf ArgoCD
            fi
            git clone https://${GIT_TOKEN}@github.com/dojimanetwork/ArgoCD.git
            cd ArgoCD/apps/dojima-foundation/overlays/${environment}
            /var/lib/jenkins/kustomize edit set image ${registry}/${IMAGENAME}:${imageTag}
            git add .
            git commit -m "Update image ${registry}/${IMAGENAME} with ${imageTag}"
            git push origin main
            cd ${WORKSPACE} && rm -r ArgoCD
        """
    }
} 