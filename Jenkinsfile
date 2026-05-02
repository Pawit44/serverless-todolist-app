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
                // โปรเจกต์นี้เรายังไม่ได้เขียน Unit Test เชิงลึก เลยให้มัน Echo ไปก่อนครับ 
                // หรือถ้าอยากเทสต์จริงๆ อาจจะใช้ npm install & npm run build เพื่อเช็คว่าโค้ดคอมไพล์ผ่านไหม
                echo 'Building and Testing code...'
                sh 'echo "Simulating tests... Passed!"'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker Images...'
                script {
                    // Build Frontend
                    sh "docker build -t ${DOCKER_USER}/todo-frontend:${IMAGE_TAG} ./app/frontend"
                    sh "docker build -t ${DOCKER_USER}/todo-frontend:latest ./app/frontend"
                    
                    // Build Backend
                    sh "docker build -t ${DOCKER_USER}/todo-backend:${IMAGE_TAG} ./app/backend"
                    sh "docker build -t ${DOCKER_USER}/todo-backend:latest ./app/backend"
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
        
        // Stage สำหรับ Deploy ด้วย Terraform/Ansible จะถูกเพิ่มใน Phase 3-4[cite: 1]
    }
}