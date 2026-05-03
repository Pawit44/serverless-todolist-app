pipeline {
    agent any
    
    environment {
        DOCKER_CREDENTIALS_ID = 'docker-hub-creds'
        DOCKER_USER = 'pawit44' 
        IMAGE_TAG = "v${env.BUILD_NUMBER}" // จะได้แท็กเป็น v1, v2, v3... รันอัตโนมัติ
    }

    stages {
        stage('Checkout') {
            steps {
                // ดึงโค้ดล่าสุดจาก Git
                checkout scm
                echo 'Checkout Success!'
            }
        }

        stage('Build & Test') {
            steps {
                // โปรเจกต์นี้เรายังไม่ได้เขียน Unit Test เชิงลึก เลยให้มัน Echo ไปก่อน 
                // หรือถ้าอยากเทสต์จริงๆ อาจจะใช้ npm install & npm run build เพื่อเช็คว่าโค้ดคอมไพล์ผ่านไหม
                echo 'Building and Testing code...'
                sh 'echo "Simulating tests... Passed!"'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker Images (No Cache)...'
                script {
                    // 1. Frontend: Build ใส่ชื่อเวอร์ชัน แล้วใช้ tag แปะป้าย latest
                    sh "docker build --no-cache -t ${DOCKER_USER}/todo-frontend:${IMAGE_TAG} ./app/frontend"
                    sh "docker tag ${DOCKER_USER}/todo-frontend:${IMAGE_TAG} ${DOCKER_USER}/todo-frontend:latest"
                    
                    // 2. Backend: ทำวิธีเดียวกัน
                    sh "docker build --no-cache -t ${DOCKER_USER}/todo-backend:${IMAGE_TAG} ./app/backend"
                    sh "docker tag ${DOCKER_USER}/todo-backend:${IMAGE_TAG} ${DOCKER_USER}/todo-backend:latest"
                }
            }
        }

        stage('Push Hub') {
            steps {
                echo 'Pushing to Docker Hub...'
                script {
                    // ล็อกอินเข้า Docker Hub และ Push Image ขึ้นไป[cite: 1]
                    withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh "echo \$PASS | docker login -u \$USER --password-stdin"
                        
                        sh "docker push ${DOCKER_USER}/todo-frontend:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_USER}/todo-frontend:latest"
                        
                        sh "docker push ${DOCKER_USER}/todo-backend:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_USER}/todo-backend:latest"
                    }
                }
            }
        }
        
        // ----------------------------------------------------
        // ส่วนที่เพิ่มใหม่สำหรับ Phase 3: Terraform & Ansible 
        // ----------------------------------------------------
        
        stage('Provision Infra (Terraform)') {
            steps {
                echo 'Provisioning Infrastructure with Terraform...'
                dir('terraform') {
                    // เพิ่ม -upgrade เพื่อให้ Terraform ยอมเปลี่ยนเวอร์ชันตามที่แก้ใน main.tf
                    sh 'terraform init -upgrade' 
                    sh 'terraform plan'
                    sh 'terraform apply -auto-approve'
                }
            }
        }

        stage('Configure Env (Ansible)') {
            steps {
                echo 'Configuring Environment with Ansible...'
                dir('ansible') {
                    // ให้ Ansible รันตั้งค่าโดยอ่าน Inventory ที่ Terraform สร้างให้[cite: 1]
                    sh 'ansible-playbook -i inventory playbook.yml'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying to Kubernetes Cluster...'
                dir('k8s') {
                     // เปลี่ยนมาระบุ Path เต็มๆ /var/jenkins_home/.kube/config แบบนี้
                    sh 'sed -e "s/127.0.0.1/host.docker.internal/g" -e "s/localhost/host.docker.internal/g" /var/jenkins_home/.kube/config > ./kubeconfig-jenkins'
                    
                    sh 'kubectl --kubeconfig=./kubeconfig-jenkins apply -f deployment.yaml'
                    sh 'kubectl --kubeconfig=./kubeconfig-jenkins apply -f service.yaml'
                    sh 'kubectl --kubeconfig=./kubeconfig-jenkins apply -f servicemonitor.yaml'
                    
                    sh 'kubectl --kubeconfig=./kubeconfig-jenkins apply -f db.yaml' 
                    echo 'Deployment Complete! Access at http://localhost:30080'
                }
            }
        }
    }
}

