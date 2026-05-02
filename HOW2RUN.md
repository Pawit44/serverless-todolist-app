คู่มือ Workflow: CI/CD กับ Jenkins + Kubernetes
🟢 Step 1: ปลุกระบบพื้นฐาน (Start Infrastructure)
เปิด Docker Desktop และรอจนไอคอนขึ้นสีเขียว (Engine Running) จากนั้นตรวจสอบที่มุมซ้ายล่างให้แน่ใจว่าไอคอน Kubernetes ก็ขึ้นสีเขียวด้วย

🏭 Step 2: เปิดโรงงาน Jenkins (Start CI/CD Server)

⚠️ ตอนนี้เราจะไม่รัน Todo App ด้วย docker compose อีกต่อไป — รันแค่ Jenkins เท่านั้น

bashdocker compose -f docker-compose.jenkins.yml up -d
จากนั้นเข้าไปเช็คที่ http://localhost:8080 ว่า Jenkins พร้อมทำงานแล้ว

💻 Step 3: ลงมือเขียนโค้ด (Development Phase)
เปิด VS Code แล้วแก้ไขโค้ดตามต้องการ
ทดสอบแบบเร็ว (Optional): หากแก้แค่ UI เล็กน้อย สามารถรันในโฟลเดอร์ frontend ได้เลย
bashnpm run dev
# ดูผลที่ localhost:3000 (ไม่ต้องยุ่งกับพอร์ต 30080 หรือ K8s)

🚀 Step 4: ส่งโค้ดขึ้นระบบ (Version Control)
bashgit add .
git commit -m "feat: อธิบายว่าวันนี้ทำอะไรไปบ้าง"
git push origin dev

🤖 Step 5: สั่งหุ่นยนต์ทำงาน (Trigger CI/CD)

เข้าไปที่ Jenkins → http://localhost:8080
เปิดโปรเจกต์ Pipeline ของคุณ
กดปุ่ม ▶️ Build Now

Jenkins จะดำเนินการต่อไปนี้โดยอัตโนมัติ:
ลำดับสิ่งที่ Jenkins ทำ1ดึงโค้ดล่าสุดจาก GitHub2สร้าง Docker Image ใหม่ (Frontend + Backend)3อัปเดต Image ขึ้น Kubernetes4Restart Pods เพื่อใช้โค้ดใหม่

🌐 Step 6: ตรวจสอบผลงาน (Verify)
เมื่อ Jenkins ขึ้น ไฟเขียวครบทุก Stage แล้ว:

เปิดบราวเซอร์ในโหมด Incognito (ป้องกัน Cache เก่า)
เข้าไปที่ http://localhost:30080
ทดลองใช้งาน เพิ่ม/ลบข้อมูล เพื่อยืนยันว่าทุกอย่างทำงานร่วมกับ Database บน K8s ได้ปกติ


🛠️ คำสั่งฉุกเฉิน (Troubleshooting)
ใช้เมื่อ Jenkins ขึ้นสีเขียวแต่หน้าเว็บยังเป็นของเก่า หรือระบบมีปัญหา
bash# ดู Pods ที่กำลังรันอยู่
kubectl get pods

# บังคับลบ Pods เพื่อให้ K8s ดึง Image ใหม่ชัวร์ๆ
kubectl delete pods -l app=todo

# ดู Log ข้างใน Pod กรณีแอปพัง
kubectl logs <ชื่อ-pod-ที่ได้จากคำสั่งแรก>

💡 สรุปจำง่าย
เปิด Docker → สตาร์ท Jenkins → แก้โค้ด → Push Git → กด Build Now → เช็คเว็บ 30080