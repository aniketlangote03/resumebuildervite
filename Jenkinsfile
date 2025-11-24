pipeline {

    agent any   // RUN LOCALLY ON JENKINS, NOT KUBERNETES

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
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('SonarQube Analysis') {
            steps {
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

        stage('Build Docker Image') {
            steps {
                script {
                    def tag = env.BUILD_NUMBER
                    sh "docker build -t ${DOCKER_IMAGE}:${tag} ."
                    sh "docker tag ${DOCKER_IMAGE}:${tag} ${DOCKER_IMAGE}:latest"
                }
            }
        }

        stage('Push Docker Image to Nexus') {
            steps {
                script {
                    docker.withRegistry("${DOCKER_REGISTRY_URL}", "nexus-creds-resumebuilder") {
                        sh "docker push ${DOCKER_IMAGE}:${env.BUILD_NUMBER}"
                        sh "docker push ${DOCKER_IMAGE}:latest"
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                sh """
                    docker rm -f resume-builder-container || true
                    docker run -d -p 8080:80 \
                      --name resume-builder-container \
                      ${DOCKER_IMAGE}:latest
                """
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
