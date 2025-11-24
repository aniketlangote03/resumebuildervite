pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:20-alpine    # ✔ FIXED Node version
    command: ["cat"]
    tty: true
  - name: docker
    image: docker:dind
    securityContext:
      privileged: true
    tty: true
  - name: jnlp
    image: jenkins/inbound-agent:3309.v27b9314fd1a4-1
    tty: true
"""
        }
    }

    environment {
        SONARQUBE_ENV = "sonarqube-imcc"
        SONARQUBE_AUTH_TOKEN = credentials('sonar-token')

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
            environment {
                scannerHome = tool 'sonar-scanner'
            }
            steps {
                container('node') {
                    withSonarQubeEnv("${SONARQUBE_ENV}") {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
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
                    script {
                        def tag = "${env.BUILD_NUMBER}"
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
                    script {
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
