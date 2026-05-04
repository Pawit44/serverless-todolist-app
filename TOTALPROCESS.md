# 🚀 Serverless & Cloud Architectures - To-Do List Project

โปรเจกต์นี้เป็นการพัฒนาระบบ To-Do List ที่สมบูรณ์ตั้งแต่การเขียนโค้ด ไปจนถึงการนำไปใช้งานจริงบน Cloud Infrastructure

**เทคโนโลยีที่ใช้:**
- **Frontend**: Next.js (React)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Deployment**: Docker + Kubernetes
- **CI/CD**: Jenkins Pipeline
- **Monitoring**: Prometheus + Grafana
- **Infrastructure as Code**: Terraform + Ansible

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```
serverless-project-practice/
│
├── 📂 app/                         # โค้ดหลักของแอปพลิเคชัน
│   ├── frontend/                   # Next.js Frontend
│   │   ├── Dockerfile              # Build Frontend Image
│   │   ├── .dockerignore
│   │   ├── next.config.js
│   │   ├── package.json
│   │   ├── pages.tsx               # หน้า Todo List
│   │   ├── public/
│   │   └── styles/
│   │
│   └── backend/                    # Node.js + Express Backend
│       ├── Dockerfile              # Build Backend Image
│       ├── .dockerignore
│       ├── package.json
│       ├── server.js                # Server Entry Point
│       ├── .env           # Template ของ Environment Variables
│
├── 📂 k8s/                         # Kubernetes Configuration Files
│   ├── db.yaml                     # PostgreSQL Deployment + Service
│   ├── deployment.yaml             # Frontend & Backend Deployment
│   ├── service.yaml                # NodePort Services
│
├── 📂 ansible/                     # Ansible Playbooks (Infrastructure Setup)
│   └── playbook.yml                # Installation Playbook
│
├── 📂 terraform/                   # Terraform Configuration (Infrastructure as Code)
│   ├── main.tf                     # Main Terraform Config
│   ├── variables.tf                # Variable Definitions
│   └── outputs.tf                  # Output Values
│
├── 📂 monitoring/                  # Monitoring & Observability
│   ├── prometheus-rules.yaml       # Prometheus Alert Rules
│   ├── monitoring.json             # Grafana Dashboard Config
│   └── values.yaml                 # Helm Values for Prometheus Stack
│
├── 📂 node_modules/                # Dependencies (Auto-generated)
│
├── 🐳 docker-compose.yml           # Local Development (All Services)
├── 🐳 docker-compose.jenkins.yml   # Jenkins Server Only
├── 🐳 Dockerfile.jenkins           # Custom Jenkins Image with Docker
│
├── 🔧 Jenkinsfile                  # CI/CD Pipeline Configuration
├── 📄 .gitignore                   # Git Ignore Rules
├── 📄 .dockerignore                # Docker Ignore Rules
│
├── 📖 H2R.md                       # How to Run (วิธีการรันระบบ)
├── 📖 H2D.md                       # How to Shutdown (วิธีการปิดระบบ)
└── 📖 TOTALPROCESS.md              # Complete Project Guide (ไฟล์นี้)
```

---

## 🎯 ไฟล์ที่สำคัญต้องสร้าง (Required Files)

### Backend (`app/backend/`)
- ✅ `package.json` - Dependencies list
- ✅ `index.js` - Main server file
- ✅ `.env.example` - Environment template
- ✅ `.env` - Local environment (ไม่ Push ⚠️)
- ✅ `Dockerfile` - Build image
- ✅ `.dockerignore` - Docker ignore rules
- ✅ `routes/todos.js` - API endpoints

### Frontend (`app/frontend/`)
- ✅ `package.json` - Dependencies list
- ✅ `pages/index.jsx` - Main page
- ✅ `.env.local` - Local environment (ไม่ Push ⚠️)
- ✅ `Dockerfile` - Build image
- ✅ `.dockerignore` - Docker ignore rules

### Docker & CI/CD (Root)
- ✅ `docker-compose.yml` - Local dev environment
- ✅ `docker-compose.jenkins.yml` - Jenkins only
- ✅ `Dockerfile.jenkins` - Custom Jenkins image
- ✅ `Jenkinsfile` - Pipeline steps
- ✅ `.gitignore` - Git ignore rules

### Kubernetes (`k8s/`)
- ✅ `db.yaml` - Database deployment
- ✅ `deployment.yaml` - App deployment
- ✅ `service.yaml` - Services exposure
- ✅ `servicemonitor.yaml` - Prometheus config

### Infrastructure as Code
- ✅ `terraform/main.tf` - Infrastructure definition
- ✅ `terraform/variables.tf` - Variables
- ✅ `terraform/outputs.tf` - Outputs
- ✅ `ansible/inventory` - Server list
- ✅ `ansible/playbook.yml` - Installation steps

### Monitoring (`monitoring/`)
- ✅ `values.yaml` - Helm values
- ✅ `prometheus-rules.yaml` - Alert rules
- ✅ `grafana-dashboard.json` - Dashboard config

---

# 🔧 Phase 1: Local Development & Setup

**เป้าหมาย:** ทำให้แอปพลิเคชันทำงานบนเครื่องของนักพัฒนา

## 📍 Step 1: ตั้งค่า Backend

### 1.1 สร้างโฟลเดอร์ & package.json

```bash
cd app/backend
npm init -y
```

### 1.2 ติดตั้ง Dependencies

```bash
npm install express cors pg dotenv
npm install --save-dev nodemon
```

### 1.3 สร้างไฟล์ `app/backend/.env.example`

```env
# Database Configuration
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
PORT=8000
NODE_ENV=development
```

⚠️ **สำคัญ:** ไฟล์นี้ไม่มี Secret Credentials ตัวจริง ใช้เป็นแบบอย่างเท่านั้น

### 1.4 สร้างไฟล์ `app/backend/.env` (ไม่ Push ⚠️)

```bash
cp .env.example .env
```

แล้วแก้ไข `.env` ด้วยค่าจริง (เฉพาะในเครื่องของคุณ):

```env
DATABASE_URL=postgresql://postgres:your_secure_password@db:5432/tododb
PORT=8000
NODE_ENV=development
```

⚠️ **เพิ่มลงใน `.gitignore` ให้แน่นอน:**

```bash
echo ".env" >> ../../.gitignore
```

### 1.5 สร้างไฟล์ `app/backend/index.js`

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

app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const { title } = req.body;
    const result = await pool.query(
      'INSERT INTO todos (title) VALUES ($1) RETURNING *',
      [title]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 8000, () => {
  console.log('Backend running on port ' + (process.env.PORT || 8000));
});
```

### 1.6 สร้างไฟล์ `app/backend/Dockerfile`

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD ["node", "index.js"]
```

### 1.7 สร้างไฟล์ `app/backend/.dockerignore`

```
node_modules
npm-debug.log
.env
.git
```

---

## 📍 Step 2: ตั้งค่า Frontend

### 2.1 สร้างโปรเจกต์ Next.js

```bash
cd app/frontend
npx create-next-app@latest . --typescript=false --tailwind=yes --eslint=yes
npm install axios
```

### 2.2 สร้างไฟล์ `app/frontend/pages/index.jsx`

```javascript
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL + '/todos');
      setTodos(response.data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  };

  const addTodo = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      await axios.post(API_URL + '/todos', { title: input });
      setInput('');
      fetchTodos();
    } catch (err) {
      console.error('Error adding todo:', err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📝 My To-Do List</h1>
        
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTodo}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {todos.length === 0 ? (
            <li className="text-gray-500 text-center py-8">No todos yet. Create one!</li>
          ) : (
            todos.map((todo) => (
              <li key={todo.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                {todo.title}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
```

### 2.3 สร้างไฟล์ `app/frontend/.env.local` (ไม่ Push ⚠️)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

⚠️ **สำคัญ:** ไฟล์นี้ต้องเพิ่มลงใน `.gitignore`:

```bash
echo ".env.local" >> ../../.gitignore
```

### 2.4 สร้างไฟล์ `app/frontend/Dockerfile`

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

### 2.5 สร้างไฟล์ `app/frontend/.dockerignore`

```
node_modules
npm-debug.log
.next
.git
.env.local
```

---

## 📍 Step 3: ตั้งค่า Docker Compose

### 3.1 สร้างไฟล์ `docker-compose.yml`

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secure_password_change_me  # ⚠️ เปลี่ยนรหัสผ่าน
      POSTGRES_DB: tododb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./app/backend
    environment:
      DATABASE_URL: postgresql://postgres:secure_password_change_me@db:5432/tododb  # ⚠️ ต้องตรงกัน
      NODE_ENV: development
      PORT: 8000
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./app/backend:/app
      - /app/node_modules

  frontend:
    build:
      context: ./app/frontend
      args:
        NEXT_PUBLIC_API_URL: http://localhost:8000
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 3.2 รันระบบ

```bash
docker compose up -d --build
```

### 3.3 เตรียม Database

```bash
docker compose exec db psql -U postgres -d tododb

# ใน psql prompt
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

\q
```

---

## 📍 Step 4: ตั้งค่า Git

### 4.1 สร้างไฟล์ `.gitignore`

```
# Environment Variables (ไม่ Push Secret ⚠️)
.env
.env.local
.env.*.local
app/**/.env
app/**/.env.local

# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build outputs
.next/
dist/
build/
out/

# Docker
.docker
postgres_data/

# IDE
.vscode/
.idea/
*.swp
*.swo
*.log

# OS
.DS_Store
Thumbs.db

# Terraform
terraform/.terraform/
terraform/*.tfstate*

# Jenkins
jenkins_home/
```

### 4.2 Initialize Git

```bash
git init
git add .
git commit -m "initial: setup todo app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/serverless-project-practice.git
git push -u origin main
```

---

# 🤖 Phase 2: Jenkins CI/CD Pipeline

**เป้าหมาย:** ทำให้ Push Code → Build & Deploy อัตโนมัติ

## 📍 Step 1: ตั้งค่า Jenkins

### 1.1 สร้างไฟล์ `Dockerfile.jenkins`

```dockerfile
FROM jenkins/jenkins:lts
USER root
RUN apt-get update && apt-get install -y docker.io git
RUN usermod -aG docker jenkins
USER jenkins
```

### 1.2 สร้างไฟล์ `docker-compose.jenkins.yml`

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
docker compose -f docker-compose.jenkins.yml logs jenkins | grep initialAdminPassword
```

เข้า http://localhost:8080 แล้วปลดล็อก

---

## 📍 Step 2: ตั้งค่า Docker Hub Credentials ⚠️

1. Jenkins → **Manage Jenkins** → **Credentials** → **Global credentials**
2. **Add Credentials**
3. Kind: **Username with password**
4. กรอก:
   - Username: Docker Hub username (สาธารณะ OK)
   - Password: **Access Token** (ไม่ใช่ password จริง ⚠️)
   - ID: `docker-hub-creds`

**วิธีสร้าง Access Token:**
1. เข้า https://hub.docker.com/settings/security
2. กด **New Access Token**
3. ตั้งชื่อ: `jenkins-token`
4. ข้อมูลจะไม่เก็บหรือ commit ขึ้น Git

---

## 📍 Step 3: สร้าง Jenkinsfile

### สร้างไฟล์ `Jenkinsfile`

```groovy
pipeline {
  agent any
  
  environment {
    DOCKER_USERNAME = credentials('docker-hub-username')
    DOCKER_PASSWORD = credentials('docker-hub-creds')
    IMAGE_FRONTEND = "${DOCKER_USERNAME}/todo-frontend:latest"
    IMAGE_BACKEND = "${DOCKER_USERNAME}/todo-backend:latest"
  }

  stages {
    stage('📥 Git Checkout') {
      steps {
        echo '📥 Pulling code...'
        checkout scm
      }
    }

    stage('🏗️ Build Images') {
      steps {
        echo '🏗️ Building Docker images...'
        sh '''
          docker build -t ${IMAGE_FRONTEND} --build-arg NEXT_PUBLIC_API_URL=http://localhost:30081 ./app/frontend
          docker build -t ${IMAGE_BACKEND} ./app/backend
        '''
      }
    }

    stage('📤 Push Images') {
      steps {
        echo '📤 Pushing to Docker Hub...'
        sh '''
          echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin
          docker push ${IMAGE_FRONTEND}
          docker push ${IMAGE_BACKEND}
          docker logout
        '''
      }
    }

    stage('🚀 Deploy') {
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
      echo '✅ Success!'
    }
    failure {
      echo '❌ Failed!'
    }
  }
}
```

---

# ☸️ Phase 3: Kubernetes Deployment

## 📍 Step 1: สร้าง Kubernetes Files

### `k8s/db.yaml`

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:
  POSTGRES_PASSWORD: postgresql_password_change_me  # ⚠️ เปลี่ยน

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
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: "tododb"
        - name: POSTGRES_USER
          value: "postgres"
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: POSTGRES_PASSWORD
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
  - port: 5432
    targetPort: 5432
  type: ClusterIP
```

### `k8s/deployment.yaml`

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-connection
type: Opaque
stringData:
  DATABASE_URL: postgresql://postgres:postgresql_password_change_me@postgres-service:5432/tododb  # ⚠️ ต้องตรงกัน

---
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
      - name: backend
        image: your-username/todo-backend:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 8000
          name: api
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-connection
              key: DATABASE_URL

      - name: frontend
        image: your-username/todo-frontend:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
          name: web
```

### `k8s/service.yaml`

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
    port: 80
    targetPort: 3000
    nodePort: 30080
  - name: api
    port: 8000
    targetPort: 8000
    nodePort: 30081
```

## 📍 Step 2: Deploy

```bash
kubectl apply -f k8s/
kubectl get pods
```

---

# 📊 Phase 4: Monitoring

### Step 1: ติดตั้ง Prometheus

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack -f monitoring/values.yaml
```

### Step 2: เพิ่ม Metrics ใน Backend

```bash
cd app/backend
npm install prom-client
```

### Step 3: Update `app/backend/index.js`

```javascript
const client = require('prom-client');

client.collectDefaultMetrics({ register: client.register });

const todoCounter = new client.Counter({
  name: 'todo_created_total',
  help: 'Total todos created'
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.post('/todos', async (req, res) => {
  try {
    const { title } = req.body;
    const result = await pool.query(
      'INSERT INTO todos (title) VALUES ($1) RETURNING *',
      [title]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  todoCounter.inc();
});
```

### Step 4: ServiceMonitor

สร้างไฟล์ `k8s/servicemonitor.yaml`

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

```bash
kubectl apply -f k8s/servicemonitor.yaml
```

### Step 5: Port-Forward

```bash
kubectl port-forward svc/monitoring-grafana 3000:80
# User: admin | Pass: prom-operator (default)
```

---

# 🧹 Phase 5: Shutdown

```bash
kubectl delete -f k8s/
helm uninstall monitoring
docker compose -f docker-compose.jenkins.yml down
docker compose down
```

---

## 🔐 Security Best Practices

1. **ไม่เคยใช้ Passwords จริงใน Code** - ใช้ Environment Variables เสมอ
2. **ไฟล์ `.env` & `.env.local` ต้องอยู่ใน `.gitignore`** - ป้องกัน Credentials ขึ้น Git
3. **ใช้ Kubernetes Secrets** - สำหรับจัดเก็บ Database passwords
4. **Access Tokens แทน Passwords** - Docker Hub ใช้ Personal Access Token
5. **rotate Secrets regularly** - เปลี่ยน Passwords ทุก 3-6 เดือน
6. **ไม่ Commit `.env` files** - ตรวจสอบด้วย `git status` ก่อน commit

---

✅ **สมบูรณ์!** โปรเจกต์พร้อมใช้งานอย่างปลอดภัย


