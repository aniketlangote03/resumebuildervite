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

  - name: cleaner
    image: bitnami/kubectl:latest
    command: ["sleep"]
    args: ["infinity"]
    tty: true

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
    command: ["cat"]
    tty: true

  - name: jnlp
    image: jenkins/inbound-agent:latest
    env:
    - name: JENKINS_AGENT_WORKDIR
      value: "/home/jenkins/agent"
    volumeMounts:
    - name: workspace-volume
      mountPath: /home/jenkins/agent

  volumes:
  - name: workspace-volume
    emptyDir: {}

"""
        }
    }

    environment {
        SONARQUBE_ENV        = "sonarqube-2401115"
        SONARQUBE_AUTH_TOKEN = credentials('sonartoken')

        NEXUS_URL    = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        DOCKER_IMAGE = "${NEXUS_URL}/my-repository/resume-builder-app"

        K8S_NAMESPACE = "2401115"
    }

    stages {

        // -------------------------
        // 🧹 NEW: CLEAN OLD AGENT PODS
        // -------------------------
        stage('Clean Old Jenkins Pods') {
            steps {
                container('cleaner') {
                    sh """
                        echo '🔍 Checking old Jenkins pods...'

                        kubectl get pods -n jenkins | grep resumebuilder- | awk '{print \$1}' | \
                        xargs -I {} kubectl delete pod {} -n jenkins --force --grace-period=0 || true

                        echo '✅ Old pods cleaned. Node is free now.'
                    """
                }
            }
        }

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
                            sonar-scanner \
                              -Dsonar.projectKey=Resumebuilder_Aniket_2401115 \
                              -Dsonar.sources=src \
                              -Dsonar.host.url=http://sonarqube.imcc.com \
                              -Dsonar.token=${SONARQUBE_AUTH_TOKEN}
                        """
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('docker') {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DUSER',
                        passwordVariable: 'DPASS'
                    )]) {

                        sh '''
                            for i in {1..20}; do
                                if docker info >/dev/null 2>&1; then break; fi
                                sleep 2
                            done
                        '''

                        script {
                            def tag = env.BUILD_NUMBER

                            sh """
                                echo "$DPASS" | docker login -u "$DUSER" --password-stdin

                                docker build -t ${DOCKER_IMAGE}:${tag} .
                                docker tag ${DOCKER_IMAGE}:${tag} ${DOCKER_IMAGE}:latest
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
                            echo "$NPASS" | docker login $NEXUS_URL -u "$NUSER" --password-stdin
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

    post {
        success { echo "🚀 Build, Push & Deploy Successful!" }
        failure { echo "❌ Pipeline failed — check logs." }
    }
}
