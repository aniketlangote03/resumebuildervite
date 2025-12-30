pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:

  - name: dind
    image: docker:24.0-dind
    securityContext:
      privileged: true
    command:
      - dockerd
    args:
      - "--host=tcp://127.0.0.1:2375"
      - "--host=unix:///var/run/docker.sock"
      - "--insecure-registry=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
    env:
      - name: DOCKER_TLS_CERTDIR
        value: ""
    volumeMounts:
      - name: workspace-volume
        mountPath: /home/jenkins/agent

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
      - name: workspace-volume
        mountPath: /home/jenkins/agent

  - name: sonar
    image: sonarsource/sonar-scanner-cli
    command: ["cat"]
    tty: true
    volumeMounts:
      - name: workspace-volume
        mountPath: /home/jenkins/agent

  volumes:
    - name: kubeconfig
      secret:
        secretName: kubeconfig-secret
    - name: workspace-volume
      emptyDir: {}
"""
    }
  }

  environment {
    REGISTRY = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
    IMAGE    = "resume-builder-app"
    TAG      = "latest"
  }

  stages {

    stage("Checkout") {
      steps {
        checkout scm
      }
    }

    stage("SonarQube Scan") {
      steps {
        container("sonar") {
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

    stage("Build Docker Image") {
      steps {
        container("dind") {
          sh '''
            docker version
            docker build -t ${IMAGE}:${TAG} .
          '''
        }
      }
    }

    stage("Login to Nexus") {
      steps {
        container("dind") {
          withCredentials([usernamePassword(
            credentialsId: 'new-nexus-creds',
            usernameVariable: 'NEXUS_USER',
            passwordVariable: 'NEXUS_PASS'
          )]) {
            sh '''
              echo "$NEXUS_PASS" | docker login http://${REGISTRY} \
                -u "$NEXUS_USER" \
                --password-stdin
            '''
          }
        }
      }
    }

    stage("Push Image") {
      steps {
        container("dind") {
          sh '''
            docker tag ${IMAGE}:${TAG} ${REGISTRY}/${IMAGE}:${TAG}
            docker push ${REGISTRY}/${IMAGE}:${TAG}
          '''
        }
      }
    }

    stage("Deploy to Kubernetes") {
      steps {
        container("kubectl") {
          sh '''
            kubectl apply -f resume-builder-k8s.yaml
            kubectl rollout status deployment/resume-builder-app -n 2401115 --timeout=180s
          '''
        }
      }
    }
  }
}
