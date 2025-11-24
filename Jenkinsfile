pipeline {
    agent any

    tools {
        nodejs "node20"
    }

    environment {
        // SonarQube Server configured in Jenkins → Manage Jenkins → Configure System
        SONARQUBE_ENV = "sonarqube-imcc"

        // Sonar token from Jenkins credentials
        SONARQUBE_AUTH_TOKEN = credentials('sonar-token')

        // Docker image in Nexus
        DOCKER_IMAGE = "nexus.imcc.com/my-repository/resume-builder-app"

        // Nexus Docker registry URL
        DOCKER_REGISTRY_URL = "http://nexus.imcc.com/repository/my-repository/"
    }

    stages {

        //-----------------------------
        // CHECKOUT GITHUB CODE
        //-----------------------------
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/aniketlangote03/resumebuildervite.git',
                    credentialsId: 'git-token-creds'
            }
        }

        //-----------------------------
        // INSTALL DEPENDENCIES
        //-----------------------------
        stage('Install Dependencies') {
            steps {
                sh 'npm ci || npm install'
            }
        }

        //-----------------------------
        // BUILD VITE APP
        //-----------------------------
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        //-----------------------------
        // SONARQUBE ANALYSIS
        //-----------------------------
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

        //-----------------------------
        // BUILD DOCKER IMAGE
        //-----------------------------
        stage('Build Docker Image') {
            steps {
                script {
                    def tag = "${env.BUILD_NUMBER}"
                    
                    // Build Docker image
                    sh "docker build -t ${DOCKER_IMAGE}:${tag} ."

                    // Latest tag
                    sh "docker tag ${DOCKER_IMAGE}:${tag} ${DOCKER_IMAGE}:latest"
                }
            }
        }

        //-----------------------------
        // PUSH DOCKER IMAGE TO NEXUS
        //-----------------------------
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

        //-----------------------------
        // DEPLOY DOCKER CONTAINER
        //-----------------------------
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
