ได้เลย นี่คือไฟล์ README.md แบบพร้อมใช้ 👇

# 🚀 CI/CD Workflow สำหรับ To-Do App  
**(Docker + Kubernetes + Jenkins)**

---

## 📌 Overview (ภาพรวม)

Workflow นี้ช่วยให้การ deploy แอปเป็นแบบอัตโนมัติทั้งหมด

> 💡 จำง่ายๆ:  
> **เขียนโค้ด → push → กด build → ระบบทำที่เหลือให้หมด**

---

## 🟢 Step 1: Start Infrastructure (ปลุกระบบพื้นฐาน)

เตรียมเครื่องให้พร้อมก่อน

- เปิด **Docker Desktop**
  - รอให้ขึ้น `Engine Running`

- เปิด **Kubernetes**
  - มุมซ้ายล่างต้องเป็นสีเขียว ✅  
  - แปลว่า cluster พร้อมแล้ว

---

## 🏭 Step 2: Start Jenkins (เปิดโรงงาน CI/CD)

> ❗ ไม่ต้องรันแอปเองแล้ว  
> รันแค่ Jenkins พอ

```bash
docker compose -f docker-compose.jenkins.yml up -d
```

ถ้าไฟล์ชื่อ docker-compose.yml:

```bash
docker compose up -d
```

เข้า Jenkins:

http://localhost:8080
💻 Step 3: Development (เขียนโค้ด)

เริ่มพัฒนาได้เลย

เปิด VS Code
แก้ไข:
Frontend (Next.js)
Backend (Node.js)
🧪 Test แบบเร็ว (Optional)
cd frontend
npm run dev

เปิด:

http://localhost:3000

⚠️ ใช้ดู UI อย่างเดียว (ไม่เกี่ยวกับ Kubernetes)

🚀 Step 4: Push Code (ส่งงานขึ้น Git)

```bash
git add .
git commit -m "feat: อธิบายสิ่งที่ทำ"
git push origin dev
```

🤖 Step 5: Trigger CI/CD (สั่ง Jenkins ทำงาน)
ไปที่:
http://localhost:8080
เข้า Pipeline
กด ▶️ Build Now
Jenkins จะทำ:
ดึงโค้ดจาก Git
Build Docker Image
Deploy ไป Kubernetes
Restart Pods

☕ นั่งรอได้เลย

🌐 Step 6: Verify (ตรวจสอบผลงาน)

เปิดแบบ Incognito แล้วเข้า:

http://localhost:30080

ลอง:

เพิ่มข้อมูล
ลบข้อมูล

เช็คว่า:

ใช้โค้ดใหม่จริง
เชื่อม Database ได้
🛠️ Troubleshooting (แก้ปัญหา)
🔍 ดู Pods
kubectl get pods
🔥 ลบ Pods (บังคับโหลดใหม่)
kubectl delete pods -l app=todo
📜 ดู Logs
kubectl logs <pod-name>
🧠 Summary
Docker → Jenkins → Code → Push → Build → Check

หรือแบบสั้นสุด:

เขียน → push → กด build → เสร็จ