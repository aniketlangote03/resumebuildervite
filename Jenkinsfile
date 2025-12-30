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
    securityContext:
      runAsUser: 0
      readOnlyRootFilesystem: false
    env:
    - name: KUBECONFIG
      value: /kube/config
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig

  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    args: ["--insecure-registry=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"]  # Add this
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json
      readOnly: true
    - name: docker-graph-storage
      mountPath: /var/lib/docker

  volumes:
  - name: docker-config
    configMap:
      name: docker-daemon-config
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
  - name: docker-graph-storage
    emptyDir: {}
'''
        }
    }

    environment {
        REGISTRY = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        REPO     = "repository/my-repository"
        IMAGE    = "resume-builder-app"
        TAG      = "latest"
    }

    stages {
        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    withCredentials([string(credentialsId: 'sonar-token-2401115', variable: 'SONAR_TOKEN')]) {
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

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    script {
                        // Wait for Docker daemon to be ready
                        sh '''
                            echo "Waiting for Docker daemon to be ready..."
                            timeout 60 sh -c 'until docker info >/dev/null 2>&1; do sleep 2; echo "Waiting..."; done'
                            echo "Docker daemon is ready!"
                        '''
                        sh '''
                            docker build -t ${IMAGE}:${TAG} .
                            docker images
                        '''
                    }
                }
            }
        }

        stage('Login to Nexus') {
            steps {
                container('dind') {
                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-docker-creds',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    )]) {
                        sh '''
                          # Verify Docker can connect to registry
                          echo "Testing connection to ${REGISTRY}..."
                          if curl -s --max-time 5 http://${REGISTRY}/v2/ >/dev/null; then
                            echo "Nexus registry is accessible"
                          else
                            echo "Warning: Cannot reach Nexus registry"
                          fi

                          echo "$NEXUS_PASS" | docker login ${REGISTRY} \
                            -u "$NEXUS_USER" --password-stdin

                          # Verify login was successful
                          docker login ${REGISTRY} \
                            -u "$NEXUS_USER" --password-stdin \
                            && echo "Login successful" \
                            || echo "Login failed"
                        '''
                    }
                }
            }
        }

        stage('Tag & Push Image') {
            steps {
                container('dind') {
                    sh '''
                        echo "Tagging image..."
                        docker tag ${IMAGE}:${TAG} ${REGISTRY}/${REPO}/${IMAGE}:${TAG}

                        echo "Pushing image to Nexus..."
                        docker push ${REGISTRY}/${REPO}/${IMAGE}:${TAG}

                        echo "Checking pushed images..."
                        docker image ls | grep ${REGISTRY}

                        # Verify the image was pushed
                        echo "Image pushed successfully to ${REGISTRY}/${REPO}/${IMAGE}:${TAG}"
                    '''
                }
            }
        }

        stage('Deploy Application') {
            steps {
                container('kubectl') {
                    sh '''
                        echo "Applying Kubernetes manifests..."
                        kubectl apply -f resume-builder-k8s.yaml

                        echo "Waiting for deployment to rollout..."
                        kubectl rollout status deployment/resume-builder-app -n 2401115 --timeout=180s

                        echo "Checking deployment status..."
                        kubectl get deployment resume-builder-app -n 2401115
                        kubectl get pods -n 2401115 -l app=resume-builder-app
                    '''
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline completed - cleaning up"
            script {
                // Clean up Docker images to save space
                container('dind') {
                    sh '''
                        echo "Cleaning up Docker images..."
                        docker image prune -f || true
                    '''
                }
            }
        }
        success {
            echo "✅ Pipeline succeeded!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}