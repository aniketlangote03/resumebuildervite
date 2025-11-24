pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  hostAliases:
  - ip: "192.168.20.250"
    hostnames:
    - "sonarqube.imcc.com"

  containers:

  - name: node
    image: node:20-alpine
    command: ["cat"]
    tty: true

  - name: docker
    image: docker:24.0.2-dind
    securityContext:
      privileged: true
    tty: true

  - name: sonar
    image: sonarsource/sonar-scanner-cli:latest
    command: ["cat"]
    tty: true

  - name: jnlp
    image: jenkins/inbound-agent:latest
    tty: true
"""
        }
    }

    environment {
        SONARQUBE_ENV = "sonarqube-2401115"
        SONARQUBE_AUTH_TOKEN = credentials('sonartoken')

        DOCKER_IMAGE = "nexus.imcc.com/resumebuilder-2401115/resume-builder-app"
        DOCKER_REGISTRY_URL = "http://nexus.imcc.com/repository/resumebuilder-2401115/"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/aniketlangote03/resumebuildervite.git',
                    credentialsId: 'git-token-creds'
            }
        }

        stage('Install Dependencies') {
            steps {
                container('node') {
                    sh 'npm install'
                }
            }
        }

        stage('Build React App') {
            steps {
                container('node') {
                    sh 'npm run build'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar') {
                    withSonarQubeEnv("${SONARQUBE_ENV}") {
                        sh """
                            sonar-scanner \
                              -Dsonar.projectKey=Resumebuilder_Aniket_2401115 \
                              -Dsonar.projectName=Resumebuilder_Aniket_2401115 \
                              -Dsonar.sources=src \
                              -Dsonar.host.url=http://sonarqube.imcc.com \
                              -Dsonar.login=${SONARQUBE_AUTH_TOKEN}
                        """
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('docker') {
                    sh 'dockerd-entrypoint.sh & sleep 12'
                    script {
                        def tag = env.BUILD_NUMBER
                        sh "docker build -t ${DOCKER_IMAGE}:${tag} ."
                        sh "docker tag ${DOCKER_IMAGE}:${tag} ${DOCKER_IMAGE}:latest"
                    }
                }
            }
        }

        stage('Push Docker Image to Nexus') {
            steps {
                container('docker') {
                    script {
                        docker.withRegistry("${DOCKER_REGISTRY_URL}", "nexus-creds-resumebuilder") {
                            sh "docker push ${DOCKER_IMAGE}:${env.BUILD_NUMBER}"
                            sh "docker push ${DOCKER_IMAGE}:latest"
                        }
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                container('docker') {
                    sh """
                        docker rm -f resume-builder-container || true
                        docker run -d -p 8080:80 \
                          --name resume-builder-container \
                          ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }
    }

    post {
        success {
            echo "🚀 Deployment successful!"
        }
        failure {
            echo "❌ Pipeline failed — check logs."
        }
    }
}
