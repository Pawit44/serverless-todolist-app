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
