🚀 CI/CD Workflow สำหรับ To-Do App (Docker + Kubernetes + Jenkins)

โปรเจกต์นี้ใช้แนวคิด CI/CD เพื่อทำให้การพัฒนาและ Deploy แอปเป็นแบบอัตโนมัติ โดยใช้ Docker, Kubernetes และ Jenkins เป็นหลัก

🟢 สเตปที่ 1: ปลุกระบบพื้นฐาน (Start Infrastructure)

สิ่งแรกที่ต้องทำคือทำให้เครื่องคอมพิวเตอร์ของคุณพร้อมสำหรับระบบ Container และ Kubernetes

เปิด Docker Desktop
รอจนไอคอนขึ้นสีเขียว (Engine Running)
เช็ค Kubernetes
มุมซ้ายล่างของ Docker Desktop ต้องเป็นสีเขียว
แปลว่า Kubernetes พร้อมใช้งานแล้ว
🏭 สเตปที่ 2: เปิดโรงงาน Jenkins (Start CI/CD Server)

⚠️ สำคัญ: จากนี้ไป ไม่ต้องใช้ docker compose รัน Todo App อีกแล้ว
เราจะรันแค่ Jenkins แล้วให้มันจัดการทุกอย่างแทน

ขั้นตอน
เปิด Terminal ไปที่ root ของโปรเจกต์
รัน Jenkins:
docker compose -f docker-compose.jenkins.yml up -d

ถ้าใช้ไฟล์ชื่อ docker-compose.yml:

docker compose up -d
เข้าเว็บ:
http://localhost:8080

เพื่อเช็คว่า Jenkins ทำงานแล้ว

💻 สเตปที่ 3: ลงมือเขียนโค้ด (Development Phase)

ตอนนี้ระบบพร้อมแล้ว คุณสามารถเริ่มเขียนโค้ดได้เลย

เปิด VS Code หรือ Editor ที่ใช้
แก้ไข:
Frontend (Next.js)
Backend (Node.js)
🧪 ทดสอบแบบเร็ว (Optional)

ถ้าแค่แก้ UI:

cd frontend
npm run dev

เข้า:

http://localhost:3000

⚠️ ไม่ต้องไปยุ่งกับ Kubernetes หรือ port 30080 ตอนนี้

🚀 สเตปที่ 4: ส่งโค้ดขึ้นระบบ (Version Control)

เมื่อทำเสร็จแล้ว:

git add .
git commit -m "feat: อธิบายว่าวันนี้ทำอะไรไปบ้าง"
git push origin dev
🤖 สเตปที่ 5: สั่งหุ่นยนต์ทำงาน (Trigger CI/CD)
ไปที่ Jenkins:
http://localhost:8080
เข้า Pipeline ของโปรเจกต์
กดปุ่ม:
▶️ Build Now
Jenkins จะทำให้ทั้งหมด:
ดึงโค้ดจาก GitHub
Build Docker Image (Frontend + Backend)
Push / Update Image
Deploy ไป Kubernetes
Restart Pods
🌐 สเตปที่ 6: ตรวจสอบผลงาน (Verify)

เมื่อ Jenkins ขึ้นสีเขียวทุก Stage:

เปิด Browser (แนะนำ Incognito)
เข้า:
http://localhost:30080
ทดสอบ:
เพิ่มข้อมูล
ลบข้อมูล

เพื่อเช็คว่าระบบทำงานครบ (Frontend + Backend + DB)

🛠️ คำสั่งฉุกเฉิน (Troubleshooting)
🔍 ดู Pods
kubectl get pods
💣 ลบ Pods (บังคับโหลดใหม่ 100%)
kubectl delete pods -l app=todo
📜 ดู Log
kubectl logs <pod-name>
💡 สรุปสั้นๆ จำง่าย
เปิด Docker
→ สตาร์ท Jenkins
→ แก้โค้ด
→ git push
→ กด Build Now
→ เปิดเว็บ 30080 เช็คงาน