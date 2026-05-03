# Serverless and Cloud Architectures - To-Do List Project

โปรเจกต์นี้เป็นการพัฒนาระบบ To-Do List (Frontend: Next.js, Backend: Node.js, Database: PostgreSQL) และนำมาทำระบบ CI/CD Pipeline อัตโนมัติ เพื่อเตรียมพร้อมสำหรับการนำไปใช้งานจริง (Deployment) บนสถาปัตยกรรม Cloud และ Kubernetes

---

## 📌 ภาพรวมโครงสร้างโปรเจกต์ (Project Structure)

```text
serverless-project-practice/
├── app/                  # โฟลเดอร์หลักสำหรับเก็บโค้ดแอปพลิเคชัน
│   ├── frontend/         # โค้ดส่วนหน้าเว็บ (Next.js)
│   │   ├── Dockerfile
│   │   └── ...
│   └── backend/          # โค้ดส่วนเซิร์ฟเวอร์ (Node.js/Express)
│       ├── Dockerfile
│       └── ...
├── docker-compose.yml          # สำหรับรันแอปพลิเคชันและฐานข้อมูล (Local)
├── docker-compose.jenkins.yml  # สำหรับรันเซิร์ฟเวอร์ Jenkins
├── Dockerfile.jenkins          # สำหรับสร้าง Image ของ Jenkins ที่รองรับ Docker
├── Jenkinsfile                 # โค้ดสำหรับกำหนดขั้นตอนการทำงานของระบบ CI/CD
└── README.md                   # เอกสารอธิบายโปรเจกต์ (ไฟล์นี้)
```

---

# 🚀 Phase 1: Local Development & Git Setup

เป้าหมายของเฟสนี้คือการทำให้แอปพลิเคชันทำงานได้บนเครื่อง Local ของนักพัฒนาทุกคนผ่าน Container (Docker) และมีการจัดการ Source Code ผ่าน Git

---

## Step 1: การเตรียมฝั่ง Backend (Node.js)

เข้าไปที่โฟลเดอร์:

```bash
cd app/backend
```

เริ่มต้นโปรเจกต์ Node.js:

```bash
npm init -y
```

ติดตั้ง Package ที่จำเป็นสำหรับการสร้าง API:

```bash
npm install express cors pg dotenv
```

ติดตั้ง Package สำหรับ Development:

```bash
npm install --save-dev nodemon
```

---

## Step 2: การตั้งค่า Environment Variables

เพื่อให้แอปพลิเคชันไม่ผูกติดกับค่าคงที่ เราจึงต้องใช้ไฟล์ `.env`
⚠️ **ห้ามนำไฟล์นี้ขึ้น Git เด็ดขาด!**

### วิธีแก้ไขกรณีเผลอเอา `.env` ขึ้น Git ไปแล้ว

ลบไฟล์ออกจาก Git Cache (ไฟล์ในเครื่องยังอยู่เหมือนเดิม):

```bash
# ถ้า .env อยู่ที่ root
git rm --cached .env

# ถ้าอยู่ใน backend
git rm --cached app/backend/.env
```

---

## Step 3: ทดสอบการทำงานด้วย Docker Compose

หลังจากเขียน Dockerfile สำหรับ Frontend และ Backend แล้ว ให้ใช้ `docker-compose.yml` เพื่อรันทั้งหมดพร้อมกัน

```bash
docker compose up -d --build
```

### ทดสอบระบบ

* Frontend: http://localhost:3000
* Backend API: http://localhost:8000

---

## Step 4: การจัดการ Database (PostgreSQL)

เข้าไปใช้งาน Database ผ่าน CLI:

```bash
docker compose exec db psql -U postgres -d tododb
```

หรือ

```bash
kubectl get pods
kubectl exec -it <ชื่อ-pod-db-ที่เจอ> -- psql -U postgres -d tododb
```


เมื่อเข้าได้แล้วจะเห็น:

```bash
tododb=#
```

แปลว่าพร้อมใช้ SQL แล้ว

---

# 🤖 Phase 2: Automation with Jenkins (CI/CD)

เป้าหมายคือทำให้ทุกครั้งที่มีการ Push Code → ระบบจะ Build และ Deploy อัตโนมัติ

---

## Step 1: การรัน Jenkins

```bash
docker compose -f docker-compose.jenkins.yml up --build -d
```

---

## Step 2: ปลดล็อก Jenkins ครั้งแรก

ดูรหัสผ่าน:

```bash
docker compose -f docker-compose.jenkins.yml logs jenkins
```

จากนั้น:

* เปิด http://localhost:8080
* ใส่รหัสผ่าน
* เลือก **Install suggested plugins**

---

## Step 3: ตั้งค่า Credentials (Docker Hub)

ไปที่:

```
Manage Jenkins > Credentials
```

ขั้นตอน:

1. เลือก System
2. เลือก Global credentials
3. กด **Add Credentials**

กรอก:

* Kind: Username with password
* Username: Docker Hub
* Password: Docker Hub
* ID: `docker-hub-creds` ⚠️ สำคัญมาก

---

## Step 4: สร้าง Pipeline

1. ไปหน้า Jenkins Dashboard
2. กด **New Item**
3. ตั้งชื่อโปรเจกต์
4. เลือก **Pipeline**

### ตั้งค่า Pipeline

* Definition: `Pipeline script from SCM`
* SCM: Git
* ใส่ URL Repo
* Branch: เช่น `*/dev`

กด **Save** แล้วลอง:

```bash
Build Now
```

---

## 🎯 ผลลัพธ์ที่ได้

เมื่อทำงานสำเร็จ:

* Jenkins จะ:

  * Pull Code
  * Build Docker Image
  * Push ขึ้น Docker Hub

* Frontend / Backend Image จะไปอยู่ใน Docker Hub อัตโนมัติ

---

## 🔥 สรุปแบบเข้าใจง่าย

ระบบนี้เหมือนมี "คนทำงานแทนเราอัตโนมัติ":

* เรา: เขียนโค้ด + push
* Jenkins: เอาโค้ดไป build + ส่งขึ้น Docker Hub

👉 เหมือนมี DevOps ส่วนตัวคอยทำงานให้ตลอดเวลา

---

ถ้าจะต่อ Phase ถัดไป (Kubernetes / Cloud Deploy) บอกได้เลย เดี๋ยวจัด flow ให้แบบเข้าใจง่าย ๆ ทีละขั้น 🚀

---

# 🏗️ Phase 3: Infrastructure & Configuration Management

เป้าหมายของเฟสนี้คือการเตรียมเครื่องเซิร์ฟเวอร์และสภาพแวดล้อมให้พร้อม ด้วยการเขียนโค้ด (Infrastructure as Code) แทนการไปคลิกติดตั้งเอง

## Step 1: สร้างโครงสร้างพื้นฐานด้วย Terraform

สร้างไฟล์ main.tf เพื่อกำหนดสเปคของเครื่องเซิร์ฟเวอร์หรือสภาพแวดล้อมที่ต้องการ

เปิด Terminal เข้าไปที่โฟลเดอร์ที่มีไฟล์ Terraform แล้วรันคำสั่งดาวน์โหลดเครื่องมือ:

```bash
terraform init
```

รันคำสั่งเพื่อตรวจสอบความถูกต้องของโค้ดและดูแผนการสร้าง:

```bash
terraform plan
```

รันคำสั่งสร้างระบบจริง (ระบบจะสร้างเครื่องและจัดการ Network ตามที่เขียนไว้):

```bash
terraform apply -auto-approve
```

## Step 2: ติดตั้งโปรแกรมพื้นฐานด้วย Ansible

สร้างไฟล์ inventory เพื่อระบุ IP Address ของเครื่องเซิร์ฟเวอร์ที่ Terraform เพิ่งสร้างเสร็จ

สร้างไฟล์ playbook.yml และเขียนขั้นตอนการติดตั้งโปรแกรมที่จำเป็น (เช่น ติดตั้ง Docker, ติดตั้ง Kubernetes)

รันคำสั่งเพื่อให้ Ansible วิ่งเข้าไปติดตั้งโปรแกรมในเซิร์ฟเวอร์เป้าหมาย:

```bash
ansible-playbook -i inventory playbook.yml
```

(หมายเหตุ: ในระบบอัตโนมัติเต็มรูปแบบ คำสั่งของ Terraform และ Ansible จะถูกนำไปใส่ไว้ให้ Jenkins เป็นผู้รันให้)

---

# ☸️ Phase 4: CI/CD Pipeline & Kubernetes

เป้าหมายของเฟสนี้คือการนำแอปพลิเคชันไปรันบน Kubernetes และผูกระบบเข้ากับ Jenkins เพื่อให้เกิดการ Deploy อัตโนมัติทุกครั้งที่มีการอัปเดตโค้ด

## Step 1: เตรียมไฟล์ตั้งค่า Kubernetes (K8s Manifests)

สร้างโฟลเดอร์ k8s/ ในโปรเจกต์ และสร้างไฟล์ YAML จำนวน 3 ไฟล์เพื่อเป็นแปลนให้ K8s:

- db.yaml: เขียนโค้ดสร้าง Database (PostgreSQL) พร้อมตั้งค่า Environment Variables
- deployment.yaml: เขียนโค้ดกำหนดให้ K8s ดึง Image ของ Frontend และ Backend มารันเป็น Pods โดยตั้งค่า imagePullPolicy: Always เพื่อให้ใช้ Image ตัวล่าสุดเสมอ
- service.yaml: เขียนโค้ดเปิดพอร์ต (NodePort) เพื่อให้คนภายนอกเข้ามาใช้งานแอปได้ (เช่น พอร์ต 30080 สำหรับเว็บ และ 30081 สำหรับ API)

## Step 2: เขียนสคริปต์สั่งงาน Jenkins (Jenkinsfile)

สร้างไฟล์ Jenkinsfile ในโฟลเดอร์หลักของโปรเจกต์ และกำหนดขั้นตอนการทำงาน (Stages) ดังนี้:

- Stage 'Git Pull': สั่งให้ Jenkins ดึงโค้ดล่าสุดจาก GitHub
- Stage 'Docker Build': สั่งรัน docker build เพื่อสร้าง Image ของ Frontend และ Backend

จุดสำคัญ: ต้องใช้ --build-arg ส่งค่า URL ของ API (เช่น http://localhost:30081) เข้าไปตอน Build Frontend ด้วย

- Stage 'Push to Docker Hub': สั่งให้ Jenkins ส่ง Image ที่สร้างเสร็จแล้วไปเก็บไว้ที่ Docker Hub
- Stage 'Deploy to Kubernetes': สั่งให้ K8s นำไฟล์ตั้งค่าไปใช้งาน และบังคับรีสตาร์ทแอปพลิเคชัน:

```bash
kubectl apply -f k8s/
kubectl rollout restart deployment todo-app
```

## Step 3: เริ่มต้นวงจร CI/CD (Developer Flow)

เมื่อตั้งค่าทุกอย่างเสร็จแล้ว การทำงานจริงของโปรแกรมเมอร์จะเหลือเพียงแค่นี้:

- พัฒนาโค้ด Frontend/Backend ในเครื่อง Local ให้เสร็จ
- นำไฟล์เข้า Git และ Push โค้ดขึ้น GitHub:

```bash
git add .
git commit -m "update application"
git push origin dev
```

## Step 4: ให้ระบบทำงานอัตโนมัติ (Trigger Pipeline)

- เข้าไปที่หน้าเว็บของ Jenkins
- กดปุ่ม Build Now ที่โปรเจกต์ของคุณ
- Jenkins จะทำงานตาม Jenkinsfile อัตโนมัติ (ดึงโค้ด -> สร้าง Image -> ส่งขึ้น Docker Hub -> สั่ง K8s อัปเดต)
- เมื่อ Jenkins ทำงานเสร็จครบทุกขั้นตอน (ขึ้นสีเขียว) ผู้ใช้งานจะสามารถเข้าหน้าเว็บผ่านพอร์ตที่กำหนดไว้ และใช้งานแอปพลิเคชันเวอร์ชันล่าสุดได้ทันที

---

# 📊 Phase 5: Prometheus & Grafana (Monitoring System)

เอกสารนี้สรุปการสร้างระบบ Monitoring เพื่อตรวจจับสุขภาพของ Cluster และประสิทธิภาพของแอปพลิเคชัน โดยใช้ Prometheus ในการดึงข้อมูล (Scraping) และ Grafana ในการแสดงผล (Dashboard)

## 🛠️ สิ่งที่ต้องเตรียม (Prerequisites)

- Kubernetes Cluster: รันอยู่แล้ว (เช่น Docker Desktop หรือ Kind)
- Helm: ติดตั้งเรียบร้อยแล้ว (บน Windows ใช้ `winget install Helm`)
- Source Code: แอปพลิเคชัน Node.js ที่พร้อมแก้ไขโค้ด

## 🚀 Step 1: ติดตั้ง Infrastructure พื้นฐาน

เราใช้ `kube-prometheus-stack` ซึ่งเป็นแพ็กเกจมัดรวมที่มีทั้ง Prometheus, Grafana และ Alertmanager

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install monitoring prometheus-community/kube-prometheus-stack
```

### การตรวจสอบ

รันคำสั่ง:

```bash
kubectl get pods
```

รอจนกว่าทุก Pod จะขึ้นสถานะ `Running` (ประมาณ 2-5 นาที)

## 💻 Step 2: แก้ไขโค้ดแอปให้พ่นค่า Metrics

เพื่อให้ Prometheus ดึงข้อมูลได้ เราต้องเปิด Endpoint `/metrics` ใน Backend และใช้ Library `prom-client`

### ติดตั้ง Library

```bash
cd app/backend
npm install prom-client
```

### ตัวอย่างการเพิ่มโค้ดในไฟล์ `index.js`

```javascript
const client = require('prom-client');
client.collectDefaultMetrics({ register: client.register });

const todoCreatedCounter = new client.Counter({ name: 'todo_created_total', help: 'Total created' });
const todoToggledCounter = new client.Counter({ name: 'todo_toggled_total', help: 'Total toggled' });
const todoDeletedCounter = new client.Counter({ name: 'todo_deleted_total', help: 'Total deleted' });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.post('/todos', async (req, res) => {
  // ... logic บันทึก DB ...
  todoCreatedCounter.inc();
  // ... ส่ง response ...
});
```

### จุดสำคัญ

- ต้องเพิ่ม `.inc()` ใน API ที่เกี่ยวข้อง เช่น การสร้าง Todo, สลับสถานะ Todo, ลบ Todo
- ต้อง Build Image ใหม่ และ Push ขึ้น Docker Hub
- สั่ง `kubectl rollout restart deployment todo-app` เพื่อให้ Deployment โหลด Image ล่าสุด

## 🔗 Step 3: เชื่อมต่อ Prometheus กับ App (ServiceMonitor)

Prometheus จะไม่ดึงข้อมูลแอปโดยอัตโนมัติ เราต้องสร้าง `ServiceMonitor` เพื่อชี้ให้ Prometheus ตรวจสอบ Service ของเรา

### ตัวอย่างไฟล์ `servicemonitor.yaml`

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
```

### คำสั่งใช้งาน

```bash
kubectl apply -f servicemonitor.yaml
```

### ตรวจสอบ

- `kubectl get servicemonitor`
- `kubectl get pods` เพื่อดูว่า Prometheus Operator รันปกติ

## 📈 Step 4: สร้าง Custom Dashboard บน Grafana

เจาะอุโมงค์เข้า Grafana:

```bash
kubectl port-forward svc/monitoring-grafana 8081:80
```

เปิดเว็บ:

```text
http://localhost:8081
```

Login:

- User: `admin`
- Password: `prom-operator`

### สร้างกราฟ

1. ไปที่ `+ Add` -> `Dashboard`
2. เพิ่ม Panel ใหม่
3. Data Source: เลือก `Prometheus`
4. ใส่ Query (PromQL)

ตัวอย่าง Panel:

- `sum(todo_created_total)` ชื่อ: `Total Created`
- `sum(todo_toggled_total)` ชื่อ: `Total Toggled`
- `sum(todo_deleted_total)` ชื่อ: `Total Deleted`

ใช้ `sum()` เพื่อรวมข้อมูลจากทุก Pod และป้องกันตัวเลขหายเมื่อ Pod Restart

## 🚨 Troubleshooting Guide

ปัญหาที่พบบ่อยและวิธีแก้ไข

- Port-forward ใช้งานไม่ได้
  - สาเหตุ: พอร์ต `8081` หรือ `9090` ถูกใช้งานอยู่
  - แก้ไข: เปลี่ยนเป็นพอร์ตอื่น เช่น `8082:80`

- Login Grafana ไม่ได้
  - สาเหตุ: รหัสผ่านเริ่มต้นไม่ตรงหรือถูกเปลี่ยน
  - แก้ไข: ใช้ `helm upgrade` ตั้งค่ารหัสใหม่ หรือดูค่าใน Secret ของ Grafana

- Targets ใน Prometheus เป็น `DOWN`
  - สาเหตุ: K8s ยังรัน Image เก่าที่ไม่มี `/metrics`
  - แก้ไข: เพิ่ม `imagePullPolicy: Always` ใน Deployment และ `kubectl rollout restart deployment todo-app`

- Grafana ขึ้น `No Data`
  - สาเหตุ: Certificate บน Docker Desktop หรือ Prometheus ไม่สามารถดึงข้อมูลได้
  - แก้ไข: ตั้งค่า Helm ให้ `kubelet.serviceMonitor.insecureSkipVerify=true` หรือเช็คว่า `ServiceMonitor` ชี้ไปยัง Service และ Path ถูกต้อง

- ServiceMonitor ไม่ทำงาน
  - สาเหตุ: Label `release: monitoring` ไม่ตรงกับชื่อที่ใช้ตอน `helm install`
  - แก้ไข: ตรวจสอบชื่อ Release และ Label ให้ตรงกันเป๊ะ

---

> หมายเหตุ: เนื้อหาใหม่ส่วนนี้เพิ่มต่อท้ายจากเนื้อหาเดิมโดยไม่แก้ไขเนื้อหาเดิมเลย เพื่อให้ Phase 5 ครบถ้วนและอ่านง่ายที่สุด


