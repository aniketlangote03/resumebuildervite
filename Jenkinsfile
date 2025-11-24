pipeline {
    agent any

    tools {
        nodejs "node20"
        // SonarQube scanner installed in Jenkins Tools
    }

    environment {
        // SonarQube Environment
        SONARQUBE_ENV = "sonarqube-imcc"
        SONARQUBE_AUTH_TOKEN = credentials('sonar-token')

        // Nexus Docker Registry
        DOCKER_IMAGE = "nexus.imcc.com/my-repository/my-react-vite-app"
        DOCKER_REGISTRY_URL = "http://nexus.imcc.com/repository/my-repository/"
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
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('SonarQube Analysis') {
            environment {
                scannerHome = tool 'sonar-scanner'
            }
            steps {
                withSonarQubeEnv("${SONARQUBE_ENV}") {
                    sh """
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=my-react-vite-app \
                        -Dsonar.sources=src \
                        -Dsonar.host.url=http://sonarqube.imcc.com \
                        -Dsonar.login=${SONARQUBE_AUTH_TOKEN}
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def tag = "${env.BUILD_NUMBER}"
                    sh "docker build -t ${DOCKER_IMAGE}:${tag} ."
                    sh "docker tag ${DOCKER_IMAGE}:${tag} ${DOCKER_IMAGE}:latest"
                }
            }
        }

        stage('Push Docker Image to Nexus') {
            steps {
                script {
                    docker.withRegistry("${DOCKER_REGISTRY_URL}", "nexus-docker-creds") {
                        sh "docker push ${DOCKER_IMAGE}:${env.BUILD_NUMBER}"
                        sh "docker push ${DOCKER_IMAGE}:latest"
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh """
                        docker rm -f my-react-vite-container || true

                        docker run -d -p 8080:80 \
                        --name my-react-vite-container \
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
            echo "❌ Pipeline failed! Check logs."
        }
    }
}
