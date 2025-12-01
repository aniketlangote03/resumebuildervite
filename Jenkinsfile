pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: docker
    image: docker:24.0.2-dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    tty: true

  - name: sonar
    image: sonarsource/sonar-scanner-cli:latest
    command: ["cat"]
    tty: true

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["sleep", "infinity"]
    tty: true
    env:
    - name: KUBECONFIG
      value: /kube/config
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig

  - name: jnlp
    image: jenkins/inbound-agent:latest
    tty: true

  volumes:
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
'''
        }
    }

    stages {

        stage('Build Image') {
            steps {
                container('docker') {
                    sh '''
                    sleep 10
                    docker build -t resume-builder-app:latest .
                    docker images
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar') {
                    withCredentials([string(credentialsId: 'sonar-token-2401115', variable: 'SONAR_TOKEN')]) {
                        sh """
                        sonar-scanner \
                          -Dsonar.projectKey=Resumebuilder_Aniket_2401115 \
                          -Dsonar.sources=src \
                          -Dsonar.host.url=http://sonarqube.imcc.com \
                          -Dsonar.token=$SONAR_TOKEN
                        """
                    }
                }
            }
        }

        stage('Login & Push to Nexus') {
            steps {
                container('docker') {
                    sh '''
                    docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 -u student -p Changeme@2025
                    docker tag resume-builder-app:latest nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401115/resume-builder-app:latest
                    docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401115/resume-builder-app:latest
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    sh '''
                    kubectl apply -f resume-builder-k8s.yaml -n 2401115
                    kubectl rollout status deployment/resume-builder-app -n 2401115
                    kubectl get pods -n 2401115 -o wide
                    '''
                }
            }
        }
    }

    post {
        success { echo "🎉 Deployment Successful!" }
        failure { echo "❌ Pipeline Failed" }
    }
}
