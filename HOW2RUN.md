🚀 CI/CD Workflow สำหรับ To-Do App

(Docker + Kubernetes + Jenkins)

📌 Overview (ภาพรวม)

Workflow นี้คือการทำให้การ deploy แอปเป็นอัตโนมัติทั้งหมด

💡 จำสั้นๆ:
เขียนโค้ด → push → กด build → ระบบทำที่เหลือให้หมด

🟢 Step 1: Start Infrastructure (ปลุกระบบพื้นฐาน)

เตรียมเครื่องให้พร้อมก่อน

เปิด Docker Desktop
รอให้ขึ้น Engine Running
เปิด Kubernetes
มุมซ้ายล่างต้องเป็นสีเขียว ✅
แปลว่า cluster พร้อมแล้ว
🏭 Step 2: Start Jenkins (เปิดโรงงาน CI/CD)

เรา “ไม่ต้องรันแอปเอง” แล้วนะ
รันแค่ Jenkins พอ

docker compose -f docker-compose.jenkins.yml up -d

ถ้าไฟล์ชื่อ docker-compose.yml:

docker compose up -d

เข้า Jenkins:

http://localhost:8080
💻 Step 3: Development (เขียนโค้ด)

เริ่มทำงานได้เลย

เปิด VS Code
แก้:
Frontend (Next.js)
Backend (Node.js)
🧪 Test แบบเร็ว (Optional)
cd frontend
npm run dev

เปิด:

http://localhost:3000

⚠️ ใช้แค่ดู UI ไม่เกี่ยวกับ Kubernetes

🚀 Step 4: Push Code (ส่งงานขึ้น Git)
git add .
git commit -m "feat: อธิบายสิ่งที่ทำ"
git push origin dev
🤖 Step 5: Trigger CI/CD (สั่ง Jenkins ทำงาน)
ไปที่:
http://localhost:8080
เข้า Pipeline
กด:
▶️ Build Now
Jenkins จะทำ:
ดึงโค้ดจาก Git
Build Docker Image
Deploy ไป Kubernetes
Restart Pods

☕ จากนี้ปล่อยให้มันทำงานเอง

🌐 Step 6: Verify (ตรวจงาน)

เปิดแบบ Incognito แล้วเข้า:

http://localhost:30080

ลอง:

เพิ่มข้อมูล
ลบข้อมูล

เช็คว่า:

ใช้โค้ดใหม่จริง
เชื่อม DB ได้
🛠️ Troubleshooting (แก้ปัญหา)
🔍 ดู Pods
kubectl get pods
🔥 ลบ Pods (บังคับให้โหลดใหม่)
kubectl delete pods -l app=todo
📜 ดู Logs
kubectl logs <pod-name>
🧠 Summary (สรุปสั้นมาก)
Docker → Jenkins → Code → Push → Build → Check

หรือแบบบ้านๆ:

“เขียน → push → กดปุ่ม → เสร็จ”