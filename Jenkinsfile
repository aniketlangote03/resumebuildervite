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
    image: docker:24.0-dind
    securityContext:
      privileged: true
    # --- START OF FIX ---
    # We override the entrypoint to pass the insecure-registry flag
    command:
    - dockerd-entrypoint.sh
    args:
    - --insecure-registry=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085
    # --- END OF FIX ---
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json
    - name: docker-graph
      mountPath: /var/lib/docker

  volumes:
  - name: docker-config
    configMap:
      name: docker-daemon-config
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
  - name: docker-graph
    emptyDir: {}
'''
        }
    }

    environment {
        // Double check this URL matches exactly what is in the insecure-registry arg above
        REGISTRY = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        REPO     = "docker-hosted"
        IMAGE    = "resume-builder-app"
        TAG      = "latest"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        sleep 10
                        docker build -t ${IMAGE}:${TAG} .
                        docker images
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
                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-docker-creds',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    )]) {
                        // Added --password-stdin for security and used the REGISTRY var
                        sh '''
                          echo "$NEXUS_PASS" | docker login ${REGISTRY} \
                            -u "$NEXUS_USER" --password-stdin
                        '''
                    }
                }
            }
        }

        stage('Tag & Push Image') {
            steps {
                container('dind') {
                    // Note: I updated the target tag to match standard Nexus format: REGISTRY/REPO/IMAGE:TAG
                    sh '''
                        docker tag ${IMAGE}:${TAG} ${REGISTRY}/${REPO}/${IMAGE}:${TAG}
                        docker push ${REGISTRY}/${REPO}/${IMAGE}:${TAG}
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
                        kubectl rollout status deployment/resume-builder-app -n 2401115 --timeout=180s
                    '''
                }
            }
        }
    }
}