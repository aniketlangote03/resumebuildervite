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

  containers:

  - name: node
    image: node:20-alpine
    command: ["cat"]
    tty: true
    volumeMounts:
    - name: workspace-volume
      mountPath: /home/jenkins/agent

  - name: docker
    image: docker:24.0.2-dind
    securityContext:
      privileged: true
    command: ["dockerd-entrypoint.sh"]
    args:
      - "--host=tcp://0.0.0.0:2376"
      - "--storage-driver=overlay2"
      - "--insecure-registry=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
    env:
      - name: DOCKER_TLS_CERTDIR
        value: ""
    tty: true
    volumeMounts:
    - name: workspace-volume
      mountPath: /home/jenkins/agent

  - name: sonar
    image: sonarsource/sonar-scanner-cli:latest
    command: ["cat"]
    tty: true
    volumeMounts:
    - name: workspace-volume
      mountPath: /home/jenkins/agent

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["/bin/sh", "-c"]
    args: ["cat"]
    tty: true
    volumeMounts:
    - name: workspace-volume
      mountPath: /home/jenkins/agent
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig

  - name: jnlp
    image: jenkins/inbound-agent:latest
    command: ["/bin/sh", "-c"]
    args: ["mkdir -p /home/jenkins/agent && exec java -jar /usr/share/jenkins/agent.jar -url http://my-jenkins.jenkins.svc.cluster.local:8080 \${JENKINS_SECRET} resumebuilder-2401115-cicd-\${BUILD_NUMBER}"]
    env:
    - name: JENKINS_AGENT_WORKDIR
      value: "/home/jenkins/agent"
    - name: JENKINS_SECRET
      valueFrom:
        secretKeyRef:
          name: jenkins-agent-secret  # You need to create this secret
          key: secret
    volumeMounts:
    - name: workspace-volume
      mountPath: /home/jenkins/agent

  volumes:
  - name: workspace-volume
    emptyDir: {}
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
"""
        }
    }

    environment {
        SONARQUBE_ENV      = "sonarqube-2401115"
        SONARQUBE_AUTH_TOKEN = credentials('sonartoken-2401115')

        NEXUS_URL    = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        DOCKER_IMAGE = "${NEXUS_URL}/my-repository/resume-builder-app"

        K8S_NAMESPACE = "2401115"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/aniketlangote03/resumebuildervite.git',
                    credentialsId: 'git-token-creds'
            }
        }

        stage('Install Dependencies') {
            steps {
                container('node') {
                    sh "npm install"
                }
            }
        }

        stage('Build React App') {
            steps {
                container('node') {
                    sh "npm run build"
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar') {
                    withSonarQubeEnv("${SONARQUBE_ENV}") {
                        sh """
                            sonar-scanner \\
                              -Dsonar.projectKey=Resumebuilder_Aniket_2401115 \\
                              -Dsonar.sources=src \\
                              -Dsonar.host.url=http://sonarqube.imcc.com \\
                              -Dsonar.token=${SONARQUBE_AUTH_TOKEN}
                        """
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('docker') {
                    script {
                        // Wait for Docker daemon to start
                        sh '''
                            echo "Waiting for Docker daemon..."
                            for i in {1..30}; do
                                if docker info >/dev/null 2>&1; then
                                    echo "Docker daemon is ready!"
                                    break
                                fi
                                echo "Attempt $i/30: Docker daemon not ready yet..."
                                sleep 2
                            done
                        '''
                        
                        withCredentials([usernamePassword(
                            credentialsId: 'dockerhub-creds',
                            usernameVariable: 'DUSER',
                            passwordVariable: 'DPASS'
                        )]) {
                            sh """
                                echo "\$DPASS" | docker login -u "\$DUSER" --password-stdin
                                docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .
                                docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest
                            """
                        }
                    }
                }
            }
        }

        stage('Push Docker Image to Nexus') {
            steps {
                container('docker') {
                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-creds-resumebuilder',
                        usernameVariable: 'NUSER',
                        passwordVariable: 'NPASS'
                    )]) {
                        sh """
                            echo "\$NPASS" | docker login ${NEXUS_URL} -u "\$NUSER" --password-stdin
                            docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                            docker push ${DOCKER_IMAGE}:latest
                        """
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    withEnv(['KUBECONFIG=/kube/config']) {
                        sh """
                            kubectl get ns ${K8S_NAMESPACE} || kubectl create ns ${K8S_NAMESPACE}

                            kubectl apply -n ${K8S_NAMESPACE} -f resume-builder-deployment.yaml
                            kubectl apply -n ${K8S_NAMESPACE} -f resume-builder-service.yaml

                            kubectl get pods -n ${K8S_NAMESPACE}
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Build ${currentBuild.result ?: 'SUCCESS'}"
        }
        success { 
            echo "🚀 Build, Push & Deploy Successful!" 
        }
        failure { 
            echo "❌ Pipeline Failed – Check logs" 
        }
    }
}