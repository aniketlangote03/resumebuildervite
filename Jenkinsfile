pipeline {
    agent any

    environment {
        // SonarQube server configured in Jenkins → Manage Jenkins → Configure System
        SONARQUBE_ENV = "sonarqube-imcc"

        // Token stored in Jenkins credentials
        SONARQUBE_AUTH_TOKEN = credentials('sonar-token')
    }

    stages {

        // -----------------------------------------------------
        // 1) CHECKOUT CODE
        // -----------------------------------------------------
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/aniketlangote03/resumebuildervite.git',
                    credentialsId: 'git-token-creds'
            }
        }

        // -----------------------------------------------------
        // 2) INSTALL DEPENDENCIES
        // -----------------------------------------------------
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
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
    }

    post {
        success {
            echo "✅ Jenkins pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed — check the logs."
        }
    }
}
