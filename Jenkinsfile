pipeline {
    agent any

    tools {
        nodejs "NodeJS18"   // ✔ FIXED — Jenkins has NodeJS18, not node20
    }

    environment {
        // SonarQube server name configured in Jenkins
        SONARQUBE_ENV = "sonarqube-imcc"

        // SonarQube token stored in Jenkins credentials
        SONARQUBE_AUTH_TOKEN = credentials('sonar-token')

        // Nexus repository you created: resumebuilder-2401115
        DOCKER_IMAGE = "nexus.imcc.com/resumebuilder-2401115/resume-builder-app"

        // Nexus Docker registry URL
        DOCKER_REGISTRY_URL = "http://nexus.imcc.com/repository/resumebuilder-2401115/"
    }

    stages {

        // -----------------------------------------------------
        // 1) CHECKOUT CODE FROM GITHUB
        // -----------------------------------------------------
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/aniketlangote03/resumebuildervite.git',
                    credentialsId: 'git-token-creds'
            }
        }

        // -----------------------------------------------------
        // 2) INSTALL NODE DEPENDENCIES
        // -----------------------------------------------------
        stage('Install Dependencies') {
            steps {
                sh 'npm ci || npm install'
            }
        }

        // -----------------------------------------------------
        // 3) BUILD VITE PROJECT
        // -----------------------------------------------------
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        // -----------------------------------------------------
        // 4) SONARQUBE ANALYSIS
        // -----------------------------------------------------
        stage('SonarQube Analysis') {
            environment {
                scannerHome = tool 'sonar-scanner'
            }
            steps {
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

        // -----------------------------------------------------
        // 5) BUILD DOCKER IMAGE
        // -----------------------------------------------------
        stage('Build Docker Image') {
            steps {
                script {
                    def tag = "${env.BUILD_NUMBER}"

                    sh "docker build -t ${DOCKER_IMAGE}:${tag} ."
                    sh "docker tag ${DOCKER_IMAGE}:${tag} ${DOCKER_IMAGE}:latest"
                }
            }
        }

        // -----------------------------------------------------
        // 6) PUSH DOCKER IMAGE TO NEXUS
        // -----------------------------------------------------
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

        // -----------------------------------------------------
        // 7) DEPLOY DOCKER CONTAINER
        // -----------------------------------------------------
        stage('Deploy') {
            steps {
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

    post {
        success {
            echo "🚀 Deployment successful!"
        }
        failure {
            echo "❌ Pipeline failed! Check logs."
        }
    }
}
