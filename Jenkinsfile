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
      - "nexus.imcc.com"

  containers:

  - name: node
    image: node:20-alpine
    command: ["cat"]
    tty: true

  - name: docker
    image: docker:24.0.2-dind
    securityContext:
      privileged: true
    command:
      - dockerd-entrypoint.sh
    args:
      - "--host=tcp://0.0.0.0:2376"
      - "--storage-driver=overlay2"
    tty: true
    env:
      - name: DOCKER_TLS_CERTDIR
        value: ""

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

        DOCKER_IMAGE = "nexus.imcc.com:8083/resumebuilder-2401115/resume-builder-app"
        DOCKER_REGISTRY_URL = "http://nexus.imcc.com:8083"
    }

    stages {

        /* ========================
               CHECKOUT
        ========================= */
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/aniketlangote03/resumebuildervite.git',
                    credentialsId: 'git-token-creds'
            }
        }

        /* ========================
          INSTALL DEPENDENCIES
        ========================= */
        stage('Install Dependencies') {
            steps {
                container('node') {
                    sh 'npm install'
                }
            }
        }

        /* ========================
                BUILD
        ========================= */
        stage('Build React App') {
            steps {
                container('node') {
                    sh 'npm run build'
                }
            }
        }

        /* ========================
             SONARQUBE SCAN
        ========================= */
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
                              -Dsonar.token=${SONARQUBE_AUTH_TOKEN}
                        """
                    }
                }
            }
        }

        /* ========================
              BUILD DOCKER IMAGE
        ========================= */
        stage('Build Docker Image') {
            steps {
                container('docker') {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DH_USER',
                        passwordVariable: 'DH_PASS'
                    )]) {

                        sh '''
                            # Login to avoid Docker Hub rate limits
                            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin

                            echo "Waiting for Docker daemon to be ready..."
                            until docker info >/dev/null 2>&1; do
                              sleep 2
                            done
                        '''

                        script {
                            def tag = env.BUILD_NUMBER
                            sh """
                                docker build -t ${DOCKER_IMAGE}:${tag} .
                                docker tag ${DOCKER_IMAGE}:${tag} ${DOCKER_IMAGE}:latest
                            """
                        }
                    }
                }
            }
        }

        /* ========================
               PUSH TO NEXUS
        ========================= */
        stage('Push Docker Image to Nexus') {
            steps {
                container('docker') {
                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-creds-resumebuilder',
                        usernameVariable: 'NUSER',
                        passwordVariable: 'NPASS'
                    )]) {

                        sh """
                            echo "$NPASS" | docker login nexus.imcc.com:8083 -u "$NUSER" --password-stdin
                            docker push ${DOCKER_IMAGE}:${env.BUILD_NUMBER}
                            docker push ${DOCKER_IMAGE}:latest
                        """
                    }
                }
            }
        }

        /* ========================
                 DEPLOY
        ========================= */
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
