# 🟢 สเตปที่ 1: ปลุกระบบพื้นฐาน (Start Infrastructure)

สิ่งแรกที่ต้องทำคือทำให้เครื่องคอมพิวเตอร์ของคุณพร้อมสำหรับระบบ Container และ Kubernetes ก่อน

- **เปิด Docker Desktop**: เปิดโปรแกรม Docker Desktop ขึ้นมา และรอจนกว่าไอคอนจะขึ้นสีเขียว (Engine Running)
- **เช็ค Kubernetes**: สังเกตที่มุมซ้ายล่างของ Docker Desktop ต้องมีไอคอน Kubernetes สีเขียวด้วย (แปลว่าหมู่บ้านเซิร์ฟเวอร์พร้อมทำงานแล้ว)

---

## 🏭 สเตปที่ 2: เปิดโรงงาน Jenkins (Start CI/CD Server)

จำไว้เสมอว่า ตอนนี้เราจะไม่รันตัวแอปพลิเคชัน (Todo App) ด้วยคำสั่ง docker compose อีกต่อไปแล้ว เราจะรันแค่ Jenkins เพื่อให้มันตื่นขึ้นมารอรับคำสั่ง

- เปิด Terminal ชี้ไปที่โฟลเดอร์หลักของโปรเจกต์
- ปลุก Jenkins ด้วยคำสั่ง:

```bash
docker compose -f docker-compose.jenkins.yml up -d
```

  (หมายเหตุ: ถ้าไฟล์ compose ของคุณชื่อ docker-compose.yml เฉยๆ ก็ใช้ docker compose up -d ได้เลย)

- เข้าไปที่หน้าเว็บ http://localhost:8080 เพื่อเช็คว่า Jenkins พร้อมทำงานแล้ว

---

## 💻 สเตปที่ 3: ลงมือเขียนโค้ด (Development Phase)

ตอนนี้ระบบหลังบ้านพร้อมหมดแล้ว คุณสามารถสวมหมวก "Software Engineer" และเริ่มทำงานได้เลย

- เปิด VS Code หรือ Editor ของคุณ
- แก้ไขโค้ด Frontend (Next.js) หรือ Backend (Node.js) ตามที่คุณต้องการ

### การทดสอบตอนเขียนโค้ด (Optional):

หากคุณแค่แก้ UI เล็กๆ น้อยๆ คุณสามารถรัน npm run dev ในโฟลเดอร์ frontend เพื่อดูผลลัพธ์แบบเร็วๆ บน localhost:3000 ได้ (แต่ไม่ต้องไปยุ่งกับพอร์ต 30080 หรือ K8s นะ)

---

## 🚀 สเตปที่ 4: ส่งโค้ดขึ้นระบบ (Version Control)

เมื่อคุณเขียนโค้ดเสร็จและพอใจกับผลลัพธ์แล้ว ก็ถึงเวลาส่งงานเข้าสายพานการผลิต

- เปิด Terminal ใน VS Code
- เซฟงานลง Git:

```bash
git add .
git commit -m "feat: อธิบายว่าวันนี้ทำอะไรไปบ้าง"
git push origin dev
```

---

## 🤖 สเตปที่ 5: สั่งหุ่นยนต์ทำงาน (Trigger CI/CD)

ขั้นตอนนี้คือการปล่อยให้ระบบอัตโนมัติทำงานแทนคุณ

- กลับไปที่หน้าเว็บ Jenkins (http://localhost:8080)
- เข้าไปที่โปรเจกต์ Pipeline ของคุณ
- กดปุ่ม ▶️ Build Now

นั่งจิบกาแฟรอ... ให้ Jenkins ทำการ:

- ดึงโค้ดล่าสุดจาก GitHub
- สร้าง Docker Image ตัวใหม่ (ทั้ง Frontend/Backend)
- อัปเดต Image ขึ้นไปที่ Kubernetes
- สั่ง Restart Pods เพื่อใช้งานโค้ดใหม่ล่าสุด

---

## 🌐 สเตปที่ 6: ตรวจสอบผลงาน (Verify)

เมื่อ Jenkins ขึ้นไฟเขียวครบทุก Stage แล้ว ก็ถึงเวลาตรวจรับงาน

- เปิดบราวเซอร์ (แนะนำให้เปิดโหมดไม่ระบุตัวตน / Incognito เพื่อป้องกันบราวเซอร์จำ Cache เก่า)
- เข้าไปที่หน้าเว็บ http://localhost:30080
- ทดลองกดใช้งาน เพิ่ม/ลบ ข้อมูล เพื่อยืนยันว่าโค้ดใหม่ของคุณทำงานร่วมกับ Database บน Kubernetes ได้อย่างสมบูรณ์

---

## 🛠️ คำสั่งฉุกเฉิน (Troubleshooting / ไม้ตาย)

ในกรณีที่ระบบมีปัญหา หรือ Jenkins ขึ้นสีเขียวแต่หน้าเว็บยังเป็นของเก่า ให้ใช้คำสั่งเหล่านี้ใน Terminal :

### ดูว่ามี Pods อะไรกำลังรันอยู่บ้าง (และรอดูกล่องติด Error):

```bash
kubectl get pods
```

### บังคับลบ Pods ทิ้ง (เพื่อให้ K8s ดึง Image ใหม่แบบชัวร์ๆ 100%):

```bash
kubectl delete pods -l app=todo
```

### ดู Log ข้างใน Pod กรณีแอปพัง:

```bash
kubectl logs <ชื่อ-pod-ที่ได้จากคำสั่งแรก>
```

---

## 💡 บทสรุปจำง่ายๆ:

เปิด Docker → สตาร์ท Jenkins → แก้โค้ด → Push Git → กด Build Now → เช็คเว็บ 30080

---

## 🚀 Phase 5: Monitoring Step-by-Step

### 1. เตรียม Backend (Instrumentation)

ต้องทำให้แอป "พ่น" ข้อมูลออกมาก่อนที่ระบบอื่นจะดึงไปใช้ได้

- เข้าไปที่โฟลเดอร์ `app/backend`
- ติดตั้ง library:

```bash
npm install prom-client
```

- แก้โค้ด Backend ของคุณโดยเพิ่ม:
  - `client.collectDefaultMetrics()`
  - Counters ชื่อ `todo_created_total`, `todo_toggled_total`, `todo_deleted_total`
  - Route ใหม่ `GET /metrics`

- เมื่อแก้เสร็จ ให้ `git push` เพื่อให้ Jenkins เอาแอปเวอร์ชันใหม่ไปรันบน Kubernetes

### 2. ติดตั้งระบบ Monitoring (Infrastructure)

เมื่อแอปพร้อมแล้ว ก็ต้องติดตั้ง "เครื่องดูดข้อมูล" และ "หน้าจอวาดกราฟ"

- เข้าไปที่โฟลเดอร์ `monitoring`
- แก้ `values.yaml` โดยตั้ง:

```yaml
adminPassword: prom-operator
```

- ติดตั้ง Prometheus Stack ด้วยคำสั่งเดียว:

```bash
helm upgrade --install prometheus prometheus-community/kube-prometheus-stack -f values.yaml
```

- สั่งให้ Prometheus รู้จักแอปเราด้วย `ServiceMonitor`:

```bash
kubectl apply -f servicemonitor.yaml
```

### 3. เปิดอุโมงค์การเชื่อมต่อ (Port-Forward & ngrok)

ทำให้เราเข้าถึงหน้าจอ Grafana ที่อยู่ใน Cluster ได้

- Grafana Tunnel (Terminal 1):

```bash
kubectl port-forward svc/prometheus-grafana 3000:80
```

- Backend Tunnel (Terminal 2):

```bash
kubectl port-forward svc/todo-service 8000:8000
```
- Public Access (Terminal 3):

```bash
ngrok http 8080
```

### 4. เสกหน้า Dashboard (Import JSON)

นำโครงสร้างกราฟที่เราออกแบบไว้มาแสดงผล

- Login ผ่านลิงก์ ngrok ด้วยผู้ใช้ `admin` / รหัส `prom-operator`
- ไปที่ `Dashboards` → `New` → `Import`
- วาง JSON Model ที่มี `sum()` และ `job="todo-service"`
- เลือก Data Source เป็น `Prometheus`
- กด `Import`

### 5. ตรวจสอบและ Demo (Testing)

ทำให้กราฟขยับเพื่อโชว์ความสำเร็จ

- Generate Data: เปิดหน้าเว็บแอป Todo แล้วกด `เพิ่ม`, `ติ๊กถูก`, และ `ลบ` งานรัวๆ
- Check Metrics: เข้า `http://localhost:8000/metrics` ดูว่ายอดตัวเลขขยับตามไหม
- Real-time Show: กลับไปดู Grafana จะเห็นกราฟ CPU, RAM และยอดรวม Todo ขยับแบบ Real-time

✅ สรุปสั้นๆ: แก้โค้ด Backend → Push Git → รัน Helm Install → Apply ServiceMonitor → เปิด ngrok → Import JSON Dashboard → กดเล่นหน้าเว็บเพื่อโชว์กราฟ!
