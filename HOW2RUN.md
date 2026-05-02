# 🚀 CI/CD Workflow สำหรับ To-Do App (Docker + Kubernetes + Jenkins)

## 🟢 สเตปที่ 1: ปลุกระบบพื้นฐาน (Start Infrastructure)

สิ่งแรกที่ต้องทำคือทำให้เครื่องคอมพิวเตอร์ของคุณพร้อมสำหรับระบบ Container และ Kubernetes

- เปิด **Docker Desktop**
  - รอจนไอคอนขึ้นสีเขียว (Engine Running)

- เช็ค **Kubernetes**
  - มุมซ้ายล่างต้องเป็นสีเขียว
  - แปลว่า "หมู่บ้านเซิร์ฟเวอร์" พร้อมทำงานแล้ว

---

## 🏭 สเตปที่ 2: เปิดโรงงาน Jenkins (Start CI/CD Server)

> ❗ ตอนนี้เราจะ **ไม่ใช้ docker compose รัน Todo App แล้ว**
> เราจะรันแค่ Jenkins เพื่อให้มันเป็นตัวควบคุมทั้งหมด

### วิธีทำ:

1. เปิด Terminal
2. เข้าไปที่โฟลเดอร์หลักของโปรเจกต์

3. รันคำสั่ง:

```bash
docker compose -f docker-compose.jenkins.yml up -d

💡 ถ้าไฟล์ชื่อ docker-compose.yml ใช้:

docker compose up -d
เปิดเว็บ:
http://localhost:8080
💻 สเตปที่ 3: ลงมือเขียนโค้ด (Development Phase)

ตอนนี้ระบบพร้อมแล้ว ลุยเขียนโค้ดได้เลย

สิ่งที่ทำได้:
แก้ Frontend (Next.js)
แก้ Backend (Node.js)
ทดสอบแบบเร็ว (Optional):
cd frontend
npm run dev

เปิด:

http://localhost:3000

⚠️ ใช้แค่ตอน dev เท่านั้น อย่าไปยุ่งกับ Kubernetes (30080)

🚀 สเตปที่ 4: ส่งโค้ดขึ้นระบบ (Version Control)

เมื่อโค้ดพร้อมแล้ว:

git add .
git commit -m "feat: อธิบายว่าวันนี้ทำอะไรไปบ้าง"
git push origin dev
🤖 สเตปที่ 5: สั่งหุ่นยนต์ทำงาน (Trigger CI/CD)
ไปที่ Jenkins:
http://localhost:8080
เข้า Pipeline ของคุณ
กด:
▶️ Build Now
Jenkins จะทำ:
ดึงโค้ดจาก GitHub
Build Docker Image ใหม่
Push Image
Deploy ไป Kubernetes
Restart Pods
🌐 สเตปที่ 6: ตรวจสอบผลงาน (Verify)

เมื่อ Jenkins ขึ้นเขียวครบ:

เปิด:

http://localhost:30080
ทดสอบ:
เพิ่มข้อมูล
ลบข้อมูล
เช็คว่าเชื่อม DB ได้จริง

💡 แนะนำให้ใช้ Incognito กัน Cache หลอก

🛠️ คำสั่งฉุกเฉิน (Troubleshooting)
🔍 ดู Pods ทั้งหมด
kubectl get pods
💣 ลบ Pods (Force ดึง Image ใหม่)
kubectl delete pods -l app=todo
📜 ดู Logs
kubectl logs <ชื่อ-pod>
💡 สรุปจำง่าย
เปิด Docker
→ สตาร์ท Jenkins
→ เขียนโค้ด
→ Push Git
→ กด Build Now
→ เช็คเว็บ 30080
🧠 แนวคิด (ให้เห็นภาพง่ายๆ)
Docker = โรงงานผลิตของ
Kubernetes = คนจัดการโรงงาน
Jenkins = หุ่นยนต์สั่งงานอัตโนมัติ
Git = ที่เก็บสูตรอาหาร

ทุกครั้งที่ push → Jenkins จะทำงานแทนคุณทั้งหมด 🚀