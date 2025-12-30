pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:

  - name: docker
    image: docker:24.0-dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    volumeMounts:
    - name: docker-graph
      mountPath: /var/lib/docker

  - name: sonar
    image: sonarsource/sonar-scanner-cli:latest
    command: ["cat"]
    tty: true

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
    tty: true
    env:
    - name: KUBECONFIG
      value: /kube/config
    volumeMounts:
    - name: kubeconfig
      mountPath: /kube/config
      subPath: kubeconfig

  volumes:
  - name: docker-graph
    emptyDir: {}

  - name: kubeconfig
    secret:
      secretName: kubeconfig-secret
"""
        }
    }

    environment {
        REGISTRY = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        REPOSITORY = "my-repository"
        IMAGE = "resume-builder-app"
        TAG = "latest"
    }

    stages {

        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Scan') {
            steps {
                container('sonar') {
                    withCredentials([
                        string(credentialsId: 'sonar-token-2401115', variable: 'SONAR_TOKEN')
                    ]) {
                        sh """
                        sonar-scanner \
                          -Dsonar.projectKey=Resumebuilder_Aniket_2401115 \
                          -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                          -Dsonar.token=$SONAR_TOKEN
                        """
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('docker') {
                    sh """
                        docker build -t ${IMAGE}:${TAG} .
                        docker images
                    """
                }
            }
        }

        stage('Login to Nexus') {
            steps {
                container('docker') {
                    withCredentials([
                        usernamePassword(
                            credentialsId: 'nexus-docker-creds',
                            usernameVariable: 'NEXUS_USER',
                            passwordVariable: 'NEXUS_PASS'
                        )
                    ]) {
                        sh """
                        echo "$NEXUS_PASS" | docker login ${REGISTRY} \
                          -u "$NEXUS_USER" --password-stdin
                        """
                    }
                }
            }
        }

        stage('Push Image to Nexus') {
            steps {
                container('docker') {
                    sh """
                        docker tag ${IMAGE}:${TAG} ${REGISTRY}/${REPOSITORY}/${IMAGE}:${TAG}
                        docker push ${REGISTRY}/${REPOSITORY}/${IMAGE}:${TAG}
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    sh """
                        kubectl apply -f resume-builder-k8s.yaml
                        kubectl rollout status deployment/resume-builder-app -n 2401115 --timeout=180s
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully"
        }
        failure {
            echo "❌ Pipeline failed"
        }
    }
}
