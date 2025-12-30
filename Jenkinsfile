pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
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
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig

  - name: docker
    image: docker:24.0-dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json

  volumes:
  - name: docker-config
    configMap:
      name: docker-daemon-config
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
'''
        }
    }

    environment {
        REGISTRY = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        REPO     = "my-repository"
        IMAGE    = "resume-builder-app"
        TAG      = "latest"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                container('docker') {
                    sh '''
                        echo "Building Docker image..."
                        docker build -t ${IMAGE}:${TAG} .
                        docker images
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    withCredentials([
                        string(credentialsId: 'sonar-token-2401115', variable: 'SONAR_TOKEN')
                    ]) {
                        sh '''
                          sonar-scanner \
                            -Dsonar.projectKey=Resumebuilder_Aniket_2401115 \
                            -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                            -Dsonar.token=$SONAR_TOKEN
                        '''
                    }
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
                        sh '''
                          echo "Logging into Nexus (HTTP registry)..."
                          echo "$NEXUS_PASS" | docker login http://${REGISTRY} \
                            -u "$NEXUS_USER" --password-stdin
                        '''
                    }
                }
            }
        }

        stage('Tag & Push Image') {
            steps {
                container('docker') {
                    sh '''
                        FULL_IMAGE=${REGISTRY}/${REPO}/${IMAGE}:${TAG}

                        echo "Tagging image..."
                        docker tag ${IMAGE}:${TAG} $FULL_IMAGE

                        echo "Pushing image to Nexus..."
                        docker push $FULL_IMAGE

                        docker images
                    '''
                }
            }
        }

        stage('Deploy Application') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl apply -f resume-builder-k8s.yaml
                        kubectl rollout status deployment/resume-builder-app -n 2401115 --timeout=180s
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed"
        }
    }
}
