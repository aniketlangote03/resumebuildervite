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
        REGISTRY   = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        IMAGE_NAME = "my-repository/resume-builder-app"
        IMAGE_TAG  = "${BUILD_NUMBER}"        // ✅ VERSIONED TAG
        NAMESPACE  = "2401115"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        sleep 10
                        docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                        docker images | head
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
                            -Dsonar.projectKey=Resumebuilder_Aniket_2401115s \
                            -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                            -Dsonar.token=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Login to Nexus Registry') {
            steps {
                container('dind') {
                    withCredentials([
                        usernamePassword(
                            credentialsId: 'nexus-creds',
                            usernameVariable: 'NEXUS_USER',
                            passwordVariable: 'NEXUS_PASS'
                        )
                    ]) {
                        sh '''
                          echo "$NEXUS_PASS" | docker login $REGISTRY -u "$NEXUS_USER" --password-stdin
                        '''
                    }
                }
            }
        }

        stage('Tag & Push Image') {
            steps {
                container('dind') {
                    sh '''
                        docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
                    '''
                }
            }
        }

        stage('Deploy Application') {
            steps {
                container('kubectl') {
                    sh '''
                        echo "Updating image in deployment..."
                        kubectl set image deployment/resume-builder-app \
                          resume-builder=${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} \
                          -n ${NAMESPACE}

                        kubectl rollout status deployment/resume-builder-app \
                          -n ${NAMESPACE} --timeout=300s
                    '''
                }
            }
        }

        stage('Debug Kubernetes') {
            steps {
                container('kubectl') {
                    sh '''
                        echo "==== PODS ===="
                        kubectl get pods -n ${NAMESPACE} -o wide

                        echo "==== SERVICES ===="
                        kubectl get svc -n ${NAMESPACE}

                        echo "==== INGRESS ===="
                        kubectl get ingress -n ${NAMESPACE}

                        echo "==== POD DETAILS ===="
                        kubectl describe pod -n ${NAMESPACE}
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully"
        }
        failure {
            echo "❌ Pipeline failed — check logs above"
        }
    }
}
