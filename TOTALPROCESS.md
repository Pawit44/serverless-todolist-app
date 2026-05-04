# 🚀 Serverless & Cloud Architectures - To-Do List Project

โปรเจกต์นี้เป็นการพัฒนาระบบ To-Do List ที่สมบูรณ์ตั้งแต่การเขียนโค้ด ไปจนถึงการนำไปใช้งานจริงบน Cloud Infrastructure

**เทคโนโลยีที่ใช้:**
- **Frontend**: Next.js (React)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Deployment**: Docker + Kubernetes
- **CI/CD**: Jenkins Pipeline
- **Monitoring**: Prometheus + Grafana

---

## 📁 โครงสร้างโปรเจกต์

```
serverless-project-practice/
├── app/
│   ├── frontend/                 # โค้ดหน้าเว็บ (Next.js)
│   │   ├── Dockerfile            # สำหรับสร้าง Frontend Image
│   │   ├── package.json
│   │   └── ...
│   │
│   └── backend/                  # โค้ดเซิร์ฟเวอร์ (Node.js)
│       ├── Dockerfile            # สำหรับสร้าง Backend Image
│       ├── package.json
│       ├── index.js
│       └── ...
│
├── k8s/                          # ไฟล์ตั้งค่า Kubernetes
│   ├── db.yaml                   # PostgreSQL Deployment
│   ├── deployment.yaml           # Frontend & Backend Deployment
│   └── service.yaml              # Expose Services
│
├── docker-compose.yml            # รัน Frontend/Backend/Database ในเครื่อง
├── docker-compose.jenkins.yml    # รัน Jenkins Server
├── Dockerfile.jenkins            # Jenkins Custom Image
├── Jenkinsfile                   # CI/CD Pipeline Configuration
└── README.md                     # เอกสารคำอธิบาย
```

---

# 🔧 Phase 1: Local Development & Setup

**เป้าหมาย:** ทำให้แอปพลิเคชันทำงานบนเครื่องของนักพัฒนา และจัดการ Source Code ด้วย Git

## 📍 Step 1: ตั้งค่า Backend (Node.js + Express)

### 1.1 เตรียมโฟลเดอร์

```bash
cd app/backend
```

### 1.2 สร้างไฟล์ `package.json`

```bash
npm init -y
```

คำสั่งนี้จะสร้างไฟล์ `package.json` ซึ่งเป็นไฟล์ที่เก็บข้อมูลโปรเจกต์ เช่น ชื่อ, เวอร์ชัน, และ dependencies

### 1.3 ติดตั้ง Dependencies หลัก

```bash
npm install express cors pg dotenv
```

**แต่ละ Library:**
- `express` - Framework สำหรับสร้าง API Server
- `cors` - อนุญาตให้ Frontend เรียก API จาก Server อื่น
- `pg` - Database Driver สำหรับเชื่อมต่อ PostgreSQL
- `dotenv` - อ่านค่า Environment Variables จากไฟล์ `.env`

### 1.4 ติดตั้ง Dev Dependencies

```bash
npm install --save-dev nodemon
```

`nodemon` จะ Auto-reload Server เมื่อมีการแก้ไขไฟล์ (เหมือน Hot Reload)

### 1.5 สร้างไฟล์ Backend

สร้างไฟล์ `index.js`:

```javascript
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(cors());
app.use(express.json());

// API Endpoints ของ Todo App
app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(8000, () => {
  console.log('Server running on port 8000');
});
```

### 1.6 สร้างไฟล์ `.env` (ไม่ต้อง Push ขึ้น Git)

สร้างไฟล์ `.env` ในโฟลเดอร์ `app/backend`:

```env
DATABASE_URL=postgresql://postgres:password@db:5432/tododb
```

⚠️ **เพิ่ม `.env` ลงในไฟล์ `.gitignore`:**

```
# ที่โฟลเดอร์หลังสุด
echo ".env" >> .gitignore
```

---

## 📍 Step 2: ตั้งค่า Frontend (Next.js)

### 2.1 สร้างโปรเจกต์ Next.js

```bash
cd app/frontend
npx create-next-app@latest . --typescript --tailwind
```

### 2.2 ติดตั้ง Axios สำหรับเรียก API

```bash
npm install axios
```

### 2.3 สร้าง Component

สร้างไฟล์ `pages/index.jsx` สำหรับแสดง Todo List:

```javascript
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/todos');
      setTodos(response.data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">My To-Do List</h1>
      <ul className="mt-4">
        {todos.map((todo) => (
          <li key={todo.id} className="p-2 border-b">
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

สร้างไฟล์ `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📍 Step 3: ตั้งค่า Database (PostgreSQL)

### 3.1 สร้างไฟล์ `docker-compose.yml`

สร้างไฟล์นี้ในโฟลเดอร์หลักของโปรเจกต์:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: tododb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./app/backend
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/tododb
    ports:
      - "8000:8000"
    depends_on:
      - db

  frontend:
    build: ./app/frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 3.2 รันทั้งระบบ

```bash
docker compose up -d --build
```

**ตรวจสอบ:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/todos
- Database: `docker compose exec db psql -U postgres -d tododb`

---

## 📍 Step 4: ทดสอบ Database

### เข้า Database CLI

```bash
docker compose exec db psql -U postgres -d tododb
```

จะเห็น prompt `tododb=#`

### สร้าง Table Todos

```sql
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### ใส่ข้อมูลทดสอบ

```sql
INSERT INTO todos (title, completed) VALUES ('Learn Docker', false);
INSERT INTO todos (title, completed) VALUES ('Setup Kubernetes', false);
```

### ยืนยันว่าข้อมูลอยู่

```sql
SELECT * FROM todos;
```

### ออกจาก Database

```sql
\q
```

---

## 📍 Step 5: จัดการ Git Repository

### 5.1 สร้าง `.gitignore`

สร้างไฟล์ `.gitignore` ในโฟลเดอร์หลัก:

```
# Environment
.env
.env.local
.env.*.local

# Dependencies
node_modules/
package-lock.json

# Build outputs
.next/
dist/
build/

# Docker
.docker

# IDE
.vscode/
.idea/
*.swp
```

### 5.2 Initialize Git & Push

```bash
git init
git add .
git commit -m "initial: setup todo app with docker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/serverless-project-practice.git
git push -u origin main
```

---

# 🤖 Phase 2: Continuous Integration with Jenkins

**เป้าหมาย:** ทำให้ทุกครั้งที่ Push Code → Jenkins จะ Build Image และอัปเดตโดยอัตโนมัติ

## 📍 Step 1: ติดตั้ง Jenkins

### 1.1 สร้าง `Dockerfile.jenkins` (Custom Jenkins Image)

```dockerfile
FROM jenkins/jenkins:lts
USER root
RUN apt-get update && apt-get install -y docker.io
RUN usermod -aG docker jenkins
USER jenkins
```

### 1.2 สร้าง `docker-compose.jenkins.yml`

```yaml
version: '3.8'

services:
  jenkins:
    build:
      context: .
      dockerfile: Dockerfile.jenkins
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      JENKINS_OPTS: "--httpPort=8080"

volumes:
  jenkins_home:
```

### 1.3 เปิด Jenkins

```bash
docker compose -f docker-compose.jenkins.yml up --build -d
```

### 1.4 รับรหัสผ่านเริ่มต้น

```bash
docker compose -f docker-compose.jenkins.yml logs jenkins | grep "initialAdminPassword"
```

จะเห็นรหัสแบบนี้: `7a5c3e2f0d1b4a9c8e6f5g3h2i1j0k`

### 1.5 ปลดล็อก Jenkins

1. เปิด http://localhost:8080
2. ใส่รหัสผ่านที่ได้มา
3. เลือก **Install suggested plugins**
4. ตั้งค่า Admin User

---

## 📍 Step 2: ตั้งค่า Docker Hub Credentials

Jenkins จะต้องรู้จักบัญชี Docker Hub เพื่อ Push Image

### 2.1 สร้าง Access Token ที่ Docker Hub

1. เข้า https://hub.docker.com/settings/security
2. กด **New Access Token**
3. ตั้งชื่อ: `jenkins-token`
4. คัดลอก Token

### 2.2 เพิ่ม Credentials ใน Jenkins

1. ไปที่ **Manage Jenkins** → **Credentials**
2. กด **Global credentials**
3. กด **Add Credentials**
4. เลือก **Kind: Username with password**
5. กรอก:
   - **Username**: Docker Hub Username
   - **Password**: Token ที่สร้างได้
   - **ID**: `docker-hub-creds` (สำคัญมาก!)

---

## 📍 Step 3: สร้าง Jenkinsfile

สร้างไฟล์ `Jenkinsfile` ในโฟลเดอร์หลักของโปรเจกต์:

```groovy
pipeline {
  agent any
  
  environment {
    DOCKER_REGISTRY = "docker.io"
    DOCKER_USERNAME = "your-docker-username"
    IMAGE_NAME_FRONTEND = "${DOCKER_USERNAME}/todo-frontend"
    IMAGE_NAME_BACKEND = "${DOCKER_USERNAME}/todo-backend"
  }

  stages {
    stage('Git Checkout') {
      steps {
        echo '📥 Pulling latest code from Git...'
        checkout scm
      }
    }

    stage('Build Frontend Image') {
      steps {
        echo '🏗️ Building Frontend Docker Image...'
        sh '''
          docker build -t ${IMAGE_NAME_FRONTEND}:latest \
            --build-arg NEXT_PUBLIC_API_URL=http://localhost:30081 \
            ./app/frontend
        '''
      }
    }

    stage('Build Backend Image') {
      steps {
        echo '🏗️ Building Backend Docker Image...'
        sh '''
          docker build -t ${IMAGE_NAME_BACKEND}:latest ./app/backend
        '''
      }
    }

    stage('Push to Docker Hub') {
      steps {
        echo '📤 Pushing images to Docker Hub...'
        withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
            docker push ${IMAGE_NAME_FRONTEND}:latest
            docker push ${IMAGE_NAME_BACKEND}:latest
          '''
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        echo '🚀 Deploying to Kubernetes...'
        sh '''
          kubectl apply -f k8s/
          kubectl rollout restart deployment todo-app
        '''
      }
    }
  }

  post {
    success {
      echo '✅ Pipeline completed successfully!'
    }
    failure {
      echo '❌ Pipeline failed!'
    }
  }
}
```

---

## 📍 Step 4: สร้าง Pipeline Job

### 4.1 สร้าง New Job

1. ไปที่ Jenkins Dashboard
2. กด **New Item**
3. ตั้งชื่อ: `todo-app-pipeline`
4. เลือก **Pipeline**
5. กด **OK**

### 4.2 ตั้งค่า Pipeline

**General:**
- ✅ Check: **GitHub project**
- ใส่ URL: `https://github.com/YOUR_USERNAME/serverless-project-practice`

**Pipeline:**
- Definition: **Pipeline script from SCM**
- SCM: **Git**
- Repository URL: `https://github.com/YOUR_USERNAME/serverless-project-practice.git`
- Branch: `*/main` (หรือชื่อ Branch ของคุณ)
- Script Path: `Jenkinsfile`

### 4.3 กด **Save**

---

## 📍 Step 5: ทดสอบ Pipeline

### 5.1 Trigger Build Manually

1. เข้า Job ที่สร้างไป
2. กด **Build Now**
3. รอให้ Jenkins ทำการ:
   - ดึง Code จาก Git
   - Build Docker Image
   - Push ขึ้น Docker Hub
   - Deploy ไป Kubernetes

### 5.2 ตรวจสอบลอก

กด **Build** ที่เสร็จเสร็จ → **Console Output** เพื่อดูรายละเอียด

---

# ☸️ Phase 3: Kubernetes Deployment

**เป้าหมาย:** กำหนดวิธีการรัน Frontend/Backend/Database บน Kubernetes Cluster

## 📍 Step 1: เตรียมไฟล์ Kubernetes Manifests

### 1.1 สร้างไฟล์ `k8s/db.yaml` (PostgreSQL)

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: db-config
data:
  POSTGRES_DB: "tododb"
  POSTGRES_USER: "postgres"

---
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:
  POSTGRES_PASSWORD: "password"

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres-db
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres-db
  template:
    metadata:
      labels:
        app: postgres-db
    spec:
      containers:
      - name: postgres
        image: postgres:15
        ports:
        - containerPort: 5432
        envFrom:
        - configMapRef:
            name: db-config
        - secretRef:
            name: db-secret
        volumeMounts:
        - name: postgres-data
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-data
        emptyDir: {}

---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
spec:
  selector:
    app: postgres-db
  ports:
  - protocol: TCP
    port: 5432
    targetPort: 5432
  type: ClusterIP
```

### 1.2 สร้างไฟล์ `k8s/deployment.yaml` (Frontend & Backend)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: todo-app
  template:
    metadata:
      labels:
        app: todo-app
    spec:
      containers:
      # Backend Container
      - name: backend
        image: your-docker-username/todo-backend:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 8000
          name: api
        env:
        - name: DATABASE_URL
          value: "postgresql://postgres:password@postgres-service:5432/tododb"

      # Frontend Container
      - name: frontend
        image: your-docker-username/todo-frontend:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
          name: web
```

### 1.3 สร้างไฟล์ `k8s/service.yaml` (Expose Services)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: todo-service
spec:
  type: NodePort
  selector:
    app: todo-app
  ports:
  - name: web
    protocol: TCP
    port: 80
    targetPort: 3000
    nodePort: 30080  # Frontend: http://localhost:30080
  - name: api
    protocol: TCP
    port: 8000
    targetPort: 8000
    nodePort: 30081  # Backend: http://localhost:30081
```

---

## 📍 Step 2: ตรวจสอบ Kubernetes Config

```bash
# ตรวจสอบ Syntax
kubectl apply -f k8s/ --dry-run=client

# นำไปใช้งานจริง
kubectl apply -f k8s/
```

---

## 📍 Step 3: ตรวจสอบการ Deploy

```bash
# ดู Pods ทั้งหมด
kubectl get pods

# ดู Services
kubectl get svc

# ดู Logs ของ Pod
kubectl logs <pod-name>

# ทดสอบแอป
# Frontend: http://localhost:30080
# Backend: http://localhost:30081/todos
```

---

# 📊 Phase 4: Monitoring with Prometheus & Grafana

**เป้าหมาย:** สร้างระบบตรวจสอบ CPU, RAM, และ Custom Metrics ของแอป

## 📍 Step 1: ติดตั้ง Prometheus Stack

### 1.1 เพิ่ม Helm Repository

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

### 1.2 ติดตั้ง kube-prometheus-stack

```bash
helm install monitoring prometheus-community/kube-prometheus-stack
```

### 1.3 ตรวจสอบ Pods

```bash
kubectl get pods -n default

# รอจนทุก Pod เป็น Running (ประมาณ 2-5 นาที)
```

---

## 📍 Step 2: เพิ่ม Metrics Exporter ในแอป

### 2.1 ติดตั้ง prom-client

```bash
cd app/backend
npm install prom-client
```

### 2.2 แก้ไขไฟล์ `index.js`

เพิ่มโค้ดนี้ที่ด้านบน:

```javascript
const client = require('prom-client');

// Default Metrics (CPU, Memory, etc)
client.collectDefaultMetrics({ register: client.register });

// Custom Counters
const todoCreatedCounter = new client.Counter({
  name: 'todo_created_total',
  help: 'Total number of todos created'
});

const todoToggledCounter = new client.Counter({
  name: 'todo_toggled_total',
  help: 'Total number of todos toggled'
});

const todoDeletedCounter = new client.Counter({
  name: 'todo_deleted_total',
  help: 'Total number of todos deleted'
});

// Metrics Endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// เมื่อสร้าง Todo
app.post('/todos', async (req, res) => {
  // ... logic ...
  todoCreatedCounter.inc();
  // ... ส่ง response ...
});

// เมื่อแก้ไข Todo
app.put('/todos/:id', async (req, res) => {
  // ... logic ...
  todoToggledCounter.inc();
  // ... ส่ง response ...
});

// เมื่อลบ Todo
app.delete('/todos/:id', async (req, res) => {
  // ... logic ...
  todoDeletedCounter.inc();
  // ... ส่ง response ...
});
```

### 2.3 Build & Push Image ใหม่

```bash
docker build -t your-docker-username/todo-backend:latest ./app/backend
docker push your-docker-username/todo-backend:latest
```

### 2.4 Restart Deployment

```bash
kubectl rollout restart deployment todo-app
```

---

## 📍 Step 3: สร้าง ServiceMonitor

สร้างไฟล์ `k8s/servicemonitor.yaml`:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: todo-app-monitor
  labels:
    release: monitoring
spec:
  selector:
    matchLabels:
      app: todo-app
  endpoints:
  - port: api
    path: /metrics
    interval: 30s
```

### ใช้งาน

```bash
kubectl apply -f k8s/servicemonitor.yaml
```

### ตรวจสอบ

```bash
kubectl get servicemonitor
```

---

## 📍 Step 4: เปิดทูนเนล Port-Forward

**Terminal 1 - Prometheus:**
```bash
kubectl port-forward svc/monitoring-kube-prometheus 9090:9090
```
เข้า: http://localhost:9090

**Terminal 2 - Grafana:**
```bash
kubectl port-forward svc/monitoring-grafana 3000:80
```
เข้า: http://localhost:3000 (User: `admin`, Pass: `prom-operator`)

**Terminal 3 - Backend API:**
```bash
kubectl port-forward svc/todo-service 8001:8000
```
เข้า: http://localhost:8001/metrics

---

## 📍 Step 5: สร้าง Grafana Dashboard

### 5.1 Login Grafana

- URL: http://localhost:3000
- User: `admin`
- Password: `prom-operator`

### 5.2 เพิ่ม Data Source

1. ไปที่ **Configuration** → **Data Sources**
2. กด **Add data source**
3. เลือก **Prometheus**
4. URL: `http://monitoring-kube-prometheus:9090`
5. กด **Save & Test**

### 5.3 สร้าง Dashboard

1. กด **+** → **Dashboard**
2. เลือก **Add Panel**
3. กรอก PromQL Query:

**Panel 1 - Total Todos Created:**
```promql
sum(todo_created_total)
```

**Panel 2 - Total Todos Toggled:**
```promql
sum(todo_toggled_total)
```

**Panel 3 - Total Todos Deleted:**
```promql
sum(todo_deleted_total)
```

**Panel 4 - Pod CPU Usage:**
```promql
sum(rate(container_cpu_usage_seconds_total{pod=~"todo-app.*"}[5m]))
```

**Panel 5 - Pod Memory Usage:**
```promql
sum(container_memory_usage_bytes{pod=~"todo-app.*"})
```

---

## 📍 Step 6: ทดสอบแสดงผล

### ทำให้ Metrics เพิ่มขึ้น

1. เปิด Frontend: http://localhost:30080
2. กดเพิ่ม/ลบ/แก้ Task เร็วๆ 10-20 ครั้ง
3. รอ 30 วินาที

### ดูผลลัพธ์

1. กลับไป Grafana ดูกราฟ
2. ควรเห็นตัวเลขเพิ่มขึ้นแบบ Real-time ✅

---

# 🧹 Phase 5: Shutdown & Cleanup

**เป้าหมาย:** ปิดระบบอย่างถูกวิธี คืน Resources

## ปิดระบบตามลำดับ

```bash
# 1. ลบ Kubernetes Resources
kubectl delete -f k8s/

# 2. Uninstall Monitoring
helm uninstall monitoring

# 3. ปิด Jenkins
docker compose -f docker-compose.jenkins.yml down

# 4. ปิด Development Compose
docker compose down

# 5. ปิด Docker Desktop
# Windows: คลิกขวา Docker Icon → Quit
# Mac: Click Docker Icon → Quit Docker Desktop
```

---

## 📋 สรุปการใช้งาน

### การพัฒนาโค้ด (Developer Workflow)

```bash
# 1. แก้ไขโค้ด
# 2. ส่งขึ้น Git
git add .
git commit -m "feat: add new todo feature"
git push origin main

# 3. Jenkins ทำงานอัตโนมัติ
# - Build Image
# - Push to Docker Hub
# - Deploy ไป Kubernetes

# 4. ตรวจสอบผลลัพธ์
# Frontend: http://localhost:30080
# Grafana: http://localhost:3000
```

### คำสั่ง Useful

```bash
# ดูสถานะระบบ
kubectl get pods
kubectl get svc
kubectl get nodes

# ดู Logs
kubectl logs <pod-name>
kubectl logs <pod-name> -f  # Follow

# บังคับ Restart
kubectl rollout restart deployment todo-app

# Delete Pod (K8s จะสร้างใหม่)
kubectl delete pod <pod-name>

# ดู Resource Usage
kubectl top nodes
kubectl top pods
```

---

✅ **เสร็จสิ้น!** โปรเจกต์นี้ได้ครอบคลุมทั้งการพัฒนา Deployment Monitoring ครบถ้วน


