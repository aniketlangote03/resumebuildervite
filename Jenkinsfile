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

    stages {

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        sleep 15
                        docker build -t resume-builder-app:latest .
                        docker image ls
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

        stage('Login to Docker Registry') {
            steps {
                container('dind') {
                    sh '''
                        docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
                          -u admin -p Changeme@2025
                    '''
                }
            }
        }

        stage('Build - Tag - Push') {
            steps {
                container('dind') {
                    sh '''
                        docker tag resume-builder-app:latest \
                          nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/docker-hosted/resume-builder-app:latest
                        docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/docker-hosted/resume-builder-app:latest
                        docker image ls
                    '''
                }
            }
        }

        stage('Deploy Application') {
            steps {
                container('kubectl') {
                    sh '''
                        kubectl apply -f resume-builder-k8s.yaml
                        kubectl rollout status deployment/resume-builder-app -n 2401115 --timeout=120s || true
                    '''
                }
            }
        }

        // 🔍 ADDED DEBUG STAGE (IMPORTANT)
        stage('Debug Kubernetes') {
            steps {
                container('kubectl') {
                    sh '''
                        echo "==== PODS ===="
                        kubectl get pods -n 2401115 -o wide

                        echo "==== SERVICES ===="
                        kubectl get svc -n 2401115

                        echo "==== INGRESS ===="
                        kubectl get ingress -n 2401115

                        echo "==== POD DETAILS ===="
                        kubectl describe pod -n 2401115
                    '''
                }
            }
        }
    }
}
