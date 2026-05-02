🟢 สเตปที่ 1: ปลุกระบบพื้นฐาน (Start Infrastructure)
สิ่งแรกที่ต้องทำคือทำให้เครื่องคอมพิวเตอร์ของคุณพร้อมสำหรับระบบ Container และ Kubernetes ก่อน

เปิด Docker Desktop: เปิดโปรแกรม Docker Desktop ขึ้นมา และรอจนกว่าไอคอนจะขึ้นสีเขียว (Engine Running)

เช็ค Kubernetes: สังเกตที่มุมซ้ายล่างของ Docker Desktop ต้องมีไอคอน Kubernetes สีเขียวด้วย (แปลว่าหมู่บ้านเซิร์ฟเวอร์พร้อมทำงานแล้ว)

🏭 สเตปที่ 2: เปิดโรงงาน Jenkins (Start CI/CD Server)
จำไว้เสมอว่า ตอนนี้เราจะไม่รันตัวแอปพลิเคชัน (Todo App) ด้วยคำสั่ง docker compose อีกต่อไปแล้ว เราจะรันแค่ Jenkins เพื่อให้มันตื่นขึ้นมารอรับคำสั่งครับ

เปิด Terminal ชี้ไปที่โฟลเดอร์หลักของโปรเจกต์

ปลุก Jenkins ด้วยคำสั่ง:

```bash
docker compose -f docker-compose.jenkins.yml up -d
```
(หมายเหตุ: ถ้าไฟล์ compose ของคุณชื่อ docker-compose.yml เฉยๆ ก็ใช้ docker compose up -d ได้เลยครับ)

เข้าไปที่หน้าเว็บ http://localhost:8080 เพื่อเช็คว่า Jenkins พร้อมทำงานแล้ว

💻 สเตปที่ 3: ลงมือเขียนโค้ด (Development Phase)
ตอนนี้ระบบหลังบ้านพร้อมหมดแล้ว คุณสามารถสวมหมวก "Software Engineer" และเริ่มทำงานได้เลย

เปิด VS Code หรือ Editor ของคุณ

แก้ไขโค้ด Frontend (Next.js) หรือ Backend (Node.js) ตามที่คุณต้องการ

การทดสอบตอนเขียนโค้ด (Optional):

หากคุณแค่แก้ UI เล็กๆ น้อยๆ คุณสามารถรัน npm run dev ในโฟลเดอร์ frontend เพื่อดูผลลัพธ์แบบเร็วๆ บน localhost:3000 ได้ครับ (แต่ไม่ต้องไปยุ่งกับพอร์ต 30080 หรือ K8s นะครับ)

🚀 สเตปที่ 4: ส่งโค้ดขึ้นระบบ (Version Control)
เมื่อคุณเขียนโค้ดเสร็จและพอใจกับผลลัพธ์แล้ว ก็ถึงเวลาส่งงานเข้าสายพานการผลิตครับ

เปิด Terminal ใน VS Code

เซฟงานลง Git:

```bash
git add .
git commit -m "feat: อธิบายว่าวันนี้ทำอะไรไปบ้าง"
git push origin dev
```
🤖 สเตปที่ 5: สั่งหุ่นยนต์ทำงาน (Trigger CI/CD)
ขั้นตอนนี้คือการปล่อยให้ระบบอัตโนมัติทำงานแทนคุณ

กลับไปที่หน้าเว็บ Jenkins (http://localhost:8080)

เข้าไปที่โปรเจกต์ Pipeline ของคุณ

กดปุ่ม ▶️ Build Now

นั่งจิบกาแฟรอ... ให้ Jenkins ทำการ:

ดึงโค้ดล่าสุดจาก GitHub

สร้าง Docker Image ตัวใหม่ (ทั้ง Frontend/Backend)

อัปเดต Image ขึ้นไปที่ Kubernetes

สั่ง Restart Pods เพื่อใช้งานโค้ดใหม่ล่าสุด

🌐 สเตปที่ 6: ตรวจสอบผลงาน (Verify)
เมื่อ Jenkins ขึ้นไฟเขียวครบทุก Stage แล้ว ก็ถึงเวลาตรวจรับงานครับ

เปิดบราวเซอร์ (แนะนำให้เปิดโหมดไม่ระบุตัวตน / Incognito เพื่อป้องกันบราวเซอร์จำ Cache เก่า)

เข้าไปที่หน้าเว็บ http://localhost:30080

ทดลองกดใช้งาน เพิ่ม/ลบ ข้อมูล เพื่อยืนยันว่าโค้ดใหม่ของคุณทำงานร่วมกับ Database บน Kubernetes ได้อย่างสมบูรณ์

🛠️ คำสั่งฉุกเฉิน (Troubleshooting / ไม้ตาย)
ในกรณีที่ระบบมีปัญหา หรือ Jenkins ขึ้นสีเขียวแต่หน้าเว็บยังเป็นของเก่า ให้ใช้คำสั่งเหล่านี้ใน Terminal ครับ:

ดูว่ามี Pods อะไรกำลังรันอยู่บ้าง (และรอดูกล่องติด Error):

```bash
kubectl get pods
```
บังคับลบ Pods ทิ้ง (เพื่อให้ K8s ดึง Image ใหม่แบบชัวร์ๆ 100%):

```bash
kubectl delete pods -l app=todo
```
ดู Log ข้างใน Pod กรณีแอปพัง:

```bash
kubectl logs <ชื่อ-pod-ที่ได้จากคำสั่งแรก>
```
💡 บทสรุปจำง่ายๆ:
เปิด Docker -> สตาร์ท Jenkins -> แก้โค้ด -> Push Git -> กด Build Now -> เช็คเว็บ 30080
