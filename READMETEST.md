# 🚀 Serverless To-Do List App — ENG23 3074

> ระบบ To-Do List แบบ Web Application สร้างด้วย Next.js, Node.js/Express และ PostgreSQL พร้อม Docker, Jenkins CI/CD, Kubernetes Deployment และ Monitoring ด้วย Prometheus/Grafana

---

## 👥 สมาชิกในกลุ่ม

| รหัสนักศึกษา | ชื่อ-นามสกุล | ความรับผิดชอบ |
|-------------|-------------|---------------|
| B6606138 | นายธนพล สงกล้า | Git, App Development |
| B6609535 | นางสาวมุธิตา สิงห์แก้ว | Jenkins, Docker |
| B6617646 | นายภาวิฒ ฉ่ำเสนาะ | Terraform, Ansible |
| B6630409 | นายอิสรภาพ วาตุรัมย์ | Kubernetes, Monitoring |

---

## 📌 ภาพรวมโปรเจค

### แอปพลิเคชัน
- **ชื่อ:** Serverless To-Do List App
- **ประเภท:** Web Application + REST API
- **ภาษา / Framework:** Next.js, React, TypeScript, Node.js, Express, PostgreSQL
- **คำอธิบาย:** โปรเจคนี้เป็นระบบจัดการรายการงานที่สามารถเพิ่มงาน เลือกระดับความสำคัญ ทำเครื่องหมายว่าเสร็จแล้ว ลบงาน และดูจำนวนงานทั้งหมดผ่านหน้าเว็บได้ ข้อมูลถูกเก็บใน PostgreSQL และ Backend มี endpoint `/metrics` สำหรับให้ Prometheus ดึงข้อมูลไปแสดงผลบน Grafana

### Architecture Diagram
```text
Developer
    │
    ▼  git push / Build Now
 GitHub ──── webhook ────▶ Jenkins CI/CD
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
                 Build        Test      Docker Build
                                            │
                                            ▼
                                       Docker Hub
                         pawit44/todo-frontend:latest
                         pawit44/todo-backend:latest
                                            │
                                    ┌───────┴───────┐
                                    ▼               ▼
                                Terraform        Ansible
                          (create inventory)   (prepare env)
                                    │               │
                                    └───────┬───────┘
                                            ▼
                                   Kubernetes Cluster
                    ┌──────────────────────────────────────────────┐
                    │  Pod 1          Pod 2          DB Pod        │
                    │  [Frontend]     [Frontend]     [Postgres]    │
                    │  [Backend]      [Backend]                    │
                    │                                              │
                    │  Service: todo-service                       │
                    │  NodePort :30080 web / :30081 api            │
                    │  Service: db-service :5432                   │
                    └──────────────────────────────────────────────┘
                                            │
                              ┌─────────────┴──────────────┐
                              ▼                             ▼
                          Prometheus  ──────────────▶  Grafana
                        (scrape /metrics)            (dashboard)
```

---

## 📁 โครงสร้าง Repository

```text
serverless-todolist-app/
├── app/
│   ├── frontend/
│   │   ├── app/
│   │   │   ├── page.tsx            # หน้าเว็บ To-Do List หลัก
│   │   │   ├── layout.tsx          # Root layout ของ Next.js
│   │   │   └── globals.css         # Global CSS และ Tailwind import
│   │   ├── public/                 # Static assets จาก Next.js template
│   │   ├── Dockerfile              # สร้าง image สำหรับ frontend
│   │   ├── package.json            # scripts และ dependencies frontend
│   │   └── .env.production         # NEXT_PUBLIC_API_URL
│   └── backend/
│       ├── server.js               # Express API, PostgreSQL connection, metrics
│       ├── Dockerfile              # สร้าง image สำหรับ backend
│       ├── package.json            # scripts และ dependencies backend
│       └── doc.txt                 # note ขั้นตอนการ setup backend
├── k8s/
│   ├── deployment.yaml             # Deployment frontend/backend
│   ├── service.yaml                # NodePort frontend/backend
│   ├── db.yaml                     # PostgreSQL Deployment + Service
│   └── servicemonitor.yaml         # ให้ Prometheus scrape /metrics
├── terraform/
│   ├── main.tf                     # สร้าง Ansible inventory แบบ local
│   ├── variables.tf                # ตัวแปร environment
│   └── outputs.tf                  # output path ของ inventory
├── ansible/
│   └── playbook.yml                # เตรียม environment สำหรับ deployment
├── docker-compose.yml              # รัน frontend/backend/db แบบ local
├── docker-compose.jenkins.yml      # รัน Jenkins server
├── Dockerfile.jenkins              # Jenkins image ที่มี Docker, Terraform, Ansible, kubectl
├── Jenkinsfile                     # CI/CD pipeline
├── HOW2RUN.md                      # คู่มือรันระบบ
├── HOW2DOWN.md                     # คู่มือปิดระบบ
├── INFA_DEVOPS.md                  # เอกสารสรุป phase ของ DevOps
├── README.md
└── READMETEST.md
```

---

## ⚙️ สิ่งที่ต้องติดตั้งก่อน (Prerequisites)

ตรวจสอบให้แน่ใจว่าติดตั้งเครื่องมือที่จำเป็นครบก่อนเริ่มใช้งาน

| Tool | Version แนะนำ | หน้าที่ |
|------|---------------|---------|
| Git | ≥ 2.x | จัดการ source code |
| Docker Desktop | ≥ 24.x | รัน container และเปิด Kubernetes local |
| Docker Compose | มากับ Docker Desktop | รันหลาย service พร้อมกัน |
| Node.js | ≥ 18 | รัน/พัฒนา frontend และ backend |
| npm | มากับ Node.js | ติดตั้ง dependencies |
| Jenkins | LTS | ระบบ CI/CD automation |
| kubectl | ≥ 1.28 | สั่งงาน Kubernetes cluster |
| Terraform | ≥ 1.x | Infrastructure as Code |
| Ansible | ≥ 2.15 | Configuration Management |
| Helm | latest | ติดตั้ง kube-prometheus-stack |
| Prometheus / Grafana | ผ่าน Helm chart | Monitoring และ Dashboard |

> หมายเหตุ: โปรเจคนี้ออกแบบให้รันบน Docker Desktop Kubernetes เป็นหลัก จึงควรเปิด Docker Desktop และเปิด Kubernetes ให้พร้อมก่อน deploy

---

## 🏃 วิธีรันโปรเจค (Quick Start)

### 1. Clone Repository
```bash
git clone <repository-url>
cd serverless-todolist-app
```

### 2. รันแบบ Local ด้วย Docker Compose
```bash
docker compose up -d --build
```

เมื่อรันสำเร็จจะได้ service หลักดังนี้:

| Service | URL / Port |
|---------|------------|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| PostgreSQL | localhost:5432 |

### 3. ตรวจสอบ Database
```bash
docker compose exec db psql -U postgres -d tododb
```

หากเข้าได้และเห็น prompt `tododb=#` แปลว่า PostgreSQL พร้อมใช้งาน

### 4. ปิดระบบ Local
```bash
docker compose down
```

---

## 🔄 CI/CD Pipeline (Jenkins)

### ลำดับการทำงานของ Pipeline

```text
Checkout ──▶ Build & Test ──▶ Docker Build ──▶ Push Hub ──▶ Provision Infra (Terraform) ──▶ Configure Env (Ansible) ──▶ Deploy to Kubernetes
```

| Stage | คำอธิบาย |
|-------|----------|
| **Checkout** | ดึง source code ล่าสุดจาก Git |
| **Build & Test** | จำลองการ build/test ด้วยคำสั่ง echo เนื่องจากยังไม่มี unit test จริง |
| **Docker Build** | สร้าง image `todo-frontend` และ `todo-backend` ทั้ง tag ตาม build number และ `latest` |
| **Push Hub** | login Docker Hub และ push image ไปที่ `pawit44/todo-frontend` และ `pawit44/todo-backend` |
| **Provision Infra (Terraform)** | สร้างไฟล์ inventory สำหรับ Ansible ที่ `ansible/inventory` |
| **Configure Env (Ansible)** | เตรียม directory `/tmp/k8s-deployment` และตรวจสอบว่า Ansible ทำงานได้ |
| **Deploy to Kubernetes** | apply ไฟล์ `deployment.yaml`, `service.yaml`, และ `db.yaml` เข้า Kubernetes |

### วิธีรัน Jenkins
```bash
docker compose -f docker-compose.jenkins.yml up --build -d
```

เปิด Jenkins ที่:

```text
http://localhost:8080
```

ดูรหัสผ่านเริ่มต้น:

```bash
docker compose -f docker-compose.jenkins.yml logs jenkins
```

### Jenkins Credentials ที่ต้องตั้งค่า

เพิ่ม Docker Hub credential ใน Jenkins:

| Field | Value |
|-------|-------|
| Kind | Username with password |
| ID | `docker-hub-creds` |
| Username | Docker Hub username |
| Password | Docker Hub password/token |

> ค่า `docker-hub-creds` ต้องตรงกับที่กำหนดไว้ใน `Jenkinsfile`

---

## 🏗️ Infrastructure as Code

### Terraform — Provision Infrastructure

ไฟล์หลักอยู่ในโฟลเดอร์ `terraform/`

```bash
cd terraform
terraform init      # ดาวน์โหลด provider plugins
terraform plan      # ตรวจสอบว่าจะสร้างอะไรบ้าง
terraform apply -auto-approve     # สร้าง resource จริง
```

สิ่งที่ Terraform ทำในโปรเจคนี้:

- ใช้ provider `hashicorp/local`
- สร้างไฟล์ `ansible/inventory`
- ระบุ host เป็น `localhost ansible_connection=local`
- output path ของ inventory ผ่าน `outputs.tf`

### Ansible — Configure Environment

ไฟล์หลักอยู่ที่ `ansible/playbook.yml`

```bash
cd ansible
ansible-playbook -i inventory playbook.yml
```

สิ่งที่ Ansible ทำในโปรเจคนี้:

- ทำงานบน host `local`
- สร้าง directory `/tmp/k8s-deployment`
- แสดงข้อความยืนยันว่า configure environment สำเร็จ

> ใน pipeline จริง Jenkins จะเรียก Terraform และ Ansible อัตโนมัติ ไม่จำเป็นต้องรันด้วยมือทุกครั้ง

---

## ☸️ Kubernetes Deployment

### Kubernetes Resources ที่ใช้

| File | Resource | หน้าที่ |
|------|----------|---------|
| `k8s/deployment.yaml` | Deployment `todo-app` | รัน frontend และ backend จำนวน 2 replicas |
| `k8s/service.yaml` | Service `todo-service` | เปิด NodePort สำหรับ frontend/backend |
| `k8s/db.yaml` | Service + Deployment `todo-db` | รัน PostgreSQL ใน Kubernetes |
| `k8s/servicemonitor.yaml` | ServiceMonitor | ให้ Prometheus scrape backend `/metrics` |

### Apply Manifests ด้วยตัวเอง
```bash
kubectl apply -f k8s/db.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

ถ้าเปิดใช้ monitoring แล้ว ให้ apply ServiceMonitor เพิ่ม:

```bash
kubectl apply -f k8s/servicemonitor.yaml
```

### ตรวจสอบสถานะ
```bash
kubectl get pods
kubectl get svc
kubectl get deployment
```

### ผลลัพธ์ที่ควรจะได้
```text
NAME                            READY   STATUS    RESTARTS   AGE
todo-app-xxxxxxxxxx-xxxxx       2/2     Running   0          2m
todo-app-xxxxxxxxxx-yyyyy       2/2     Running   0          2m
todo-db-xxxxxxxxxx-zzzzz        1/1     Running   0          2m

NAME           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                       AGE
db-service     ClusterIP   10.96.xx.xxx    <none>        5432/TCP                      2m
todo-service   NodePort    10.96.xx.xxx    <none>        80:30080/TCP,8000:30081/TCP   2m
```

> `todo-app` แสดง `2/2` เพราะในหนึ่ง Pod มี 2 containers คือ frontend และ backend ส่วน `todo-db` เป็น PostgreSQL แยกอีก Deployment หนึ่ง

### เข้าถึงแอปพลิเคชัน

| Component | URL |
|-----------|-----|
| Frontend | http://localhost:30080 |
| Backend API | http://localhost:30081 |
| Metrics | http://localhost:30081/metrics |

---

## 📊 Monitoring

Backend ใช้ library `prom-client` เพื่อเปิด endpoint `/metrics` ให้ Prometheus ดึงข้อมูล

### Metrics สำคัญของระบบ

| Metric | ความหมาย |
|--------|----------|
| `todo_created_total` | จำนวน todo ที่ถูกสร้างสำเร็จ |
| `todo_toggled_total` | จำนวนครั้งที่มีการ toggle done/undone |
| `todo_deleted_total` | จำนวน todo ที่ถูกลบสำเร็จ |
| Default Node.js metrics | CPU, memory, event loop, process metrics จาก `collectDefaultMetrics` |

### ติดตั้ง Prometheus/Grafana ด้วย Helm
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack
```

### เปิด Grafana
```bash
kubectl port-forward svc/monitoring-grafana 8081:80
```

เปิดเว็บ:

```text
http://localhost:8081
```

ค่า login เริ่มต้นโดยทั่วไป:

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `prom-operator` |

### ตัวอย่าง PromQL สำหรับ Dashboard

| Panel | PromQL |
|-------|--------|
| Total Created | `sum(todo_created_total)` |
| Total Toggled | `sum(todo_toggled_total)` |
| Total Deleted | `sum(todo_deleted_total)` |
| Target Health | `up` |

---

## 🌿 Branching Strategy

```text
main        ──── โค้ดที่พร้อมส่งหรือ demo
dev         ──── branch หลักสำหรับพัฒนาและ trigger pipeline
feature/*   ──── branch สำหรับแยกทำ feature แต่ละส่วน
```

| Branch | คำอธิบาย |
|--------|----------|
| `main` | เก็บโค้ดเวอร์ชันหลักของโปรเจค |
| `dev` | ใช้รวมงานก่อนนำขึ้น main และใช้ทดสอบ pipeline |
| `feature/*` | ใช้พัฒนา feature ย่อยก่อน merge เข้า dev |

---

## 🧪 API Endpoints

Backend API รันที่ port `8000` ใน container และถูก expose เป็น NodePort `30081` บน Kubernetes

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| `GET` | `/todos` | ดึงรายการ todo ทั้งหมด เรียงตาม `id` |
| `POST` | `/todos?task=<task>&prio=<low\|med\|high>&time=<HH:mm>` | เพิ่ม todo ใหม่ |
| `PATCH` | `/todos/:id/toggle` | สลับสถานะ done/undone |
| `DELETE` | `/todos/:id` | ลบ todo ตาม id |
| `GET` | `/metrics` | Prometheus metrics endpoint |

### ตัวอย่างการทดสอบ API

```bash
curl http://localhost:30081/todos
```

```bash
curl -X POST "http://localhost:30081/todos?task=Read%20README&prio=high&time=10:30"
```

```bash
curl -X PATCH http://localhost:30081/todos/1/toggle
```

```bash
curl -X DELETE http://localhost:30081/todos/1
```

```bash
curl http://localhost:30081/metrics
```

---

## 🐛 ปัญหาที่พบบ่อย (Troubleshooting)

**Jenkins เปิดไม่ขึ้น**
```bash
docker compose -f docker-compose.jenkins.yml ps
docker compose -f docker-compose.jenkins.yml logs jenkins
```

**ต้องการ restart Jenkins ใหม่**
```bash
docker compose -f docker-compose.jenkins.yml down
docker compose -f docker-compose.jenkins.yml up --build -d
```

**Pods ไม่ขึ้นหรือค้างอยู่**
```bash
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

**หน้าเว็บยังเป็นเวอร์ชันเก่า**
```bash
kubectl delete pods -l app=todo
```

หรือสั่ง restart deployment:

```bash
kubectl rollout restart deployment todo-app
```

**Backend ต่อ PostgreSQL ไม่ได้**
```bash
kubectl get svc
kubectl logs deployment/todo-db
kubectl logs deployment/todo-app
```

ตรวจสอบว่าใน `k8s/deployment.yaml` มีค่า:

```text
DB_HOST=db-service
DB_USER=postgres
DB_PASSWORD=admin1234
DB_NAME=tododb
```

**Prometheus ไม่เจอ metrics**
```bash
kubectl get servicemonitor
kubectl describe servicemonitor todo-app-monitor
curl http://localhost:30081/metrics
```

ตรวจสอบว่า `ServiceMonitor` มี label `release: monitoring` และ selector ตรงกับ service label `app: todo-app`


## 📚 เอกสารอ้างอิง

- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Jenkins Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
- [Ansible Documentation](https://docs.ansible.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
