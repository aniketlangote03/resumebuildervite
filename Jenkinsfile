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
        NEXUS_REGISTRY = "nexus.nexus.svc.cluster.local:8085"
        NEXUS_REPO     = "my-repository"
        IMAGE_NAME     = "resume-builder-app"
        IMAGE_TAG      = "latest"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        sleep 10
                        docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    withCredentials([string(credentialsId: 'sonar-token-2401115', variable: 'SONAR_TOKEN')]) {
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

        stage('Login to Nexus') {
            steps {
                container('dind') {
                    withCredentials([
                        usernamePassword(
                            credentialsId: 'nexus-credentials',
                            usernameVariable: 'NEXUS_USER',
                            passwordVariable: 'NEXUS_PASS'
                        )
                    ]) {
                        sh '''
                          echo "$NEXUS_PASS" | docker login $NEXUS_REGISTRY \
                            -u "$NEXUS_USER" --password-stdin
                        '''
                    }
                }
            }
        }

        stage('Tag & Push Image') {
            steps {
                container('dind') {
                    sh '''
                        docker tag ${IMAGE_NAME}:${IMAGE_TAG} \
                          ${NEXUS_REGISTRY}/${NEXUS_REPO}/${IMAGE_NAME}:${IMAGE_TAG}

                        docker push ${NEXUS_REGISTRY}/${NEXUS_REPO}/${IMAGE_NAME}:${IMAGE_TAG}
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl apply -f resume-builder-k8s.yaml
                        kubectl rollout restart deployment resume-builder-app -n 2401115
                        kubectl rollout status deployment resume-builder-app -n 2401115 --timeout=180s
                    '''
                }
            }
        }
    }
}
