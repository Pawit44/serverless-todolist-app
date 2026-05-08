# 📋 ขั้นตอนการพัฒนา Serverless Project

## 🟢 Step 1: เตรียมระบบ
- เปิด **Docker Desktop** จนไอคอนเป็นสีเขียว
- ยืนยันว่า **Kubernetes** (ไอคอนด้านล่าง) เป็นสีเขียวด้วย

## 🏭 Step 2: เปิด Jenkins (CI/CD Server)
```bash
docker compose -f docker-compose.jenkins.yml up -d
```
- เข้า http://localhost:8080 เพื่อเช็ค Jenkins

## 💻 Step 3: เขียนโค้ด
- แก้ไข Frontend (Next.js) หรือ Backend (Node.js)
- **ตัวเลือก**: รัน `npm run dev` ในโฟลเดอร์ frontend เพื่อทดสอบที่ localhost:3000

## 🚀 Step 4: ส่งโค้ดขึ้น Git
```bash
git add .
git commit -m "feat: อธิบายว่าทำอะไร"
git push origin dev
```

## 🤖 Step 5: Trigger CI/CD
1. เข้า Jenkins (http://localhost:8080)
2. กดปุ่ม **Build Now**
3. รอจนครบทุก Stage (Jenkins จะ build Docker image และ deploy ไป Kubernetes)

## 🌐 Step 6: ตรวจสอบผลงาน
- เปิดโหมด Incognito
- เข้า http://localhost:30080
- ทดสอบ: เพิ่ม/ลบ/อัปเดต Task เพื่อยืนยันการทำงาน

---

## 🛠️ Troubleshooting

**ดูสถานะ Pods:**
```bash
kubectl get pods
```

**บังคับ refresh Image ใหม่:**
```bash
kubectl delete pods -l app=todo
```

**ดู Log ของ Pod:**
```bash
kubectl logs <ชื่อ-pod>
```

---

## 📊 Phase: Monitoring & Observability

### 1. ติดตั้ง Prometheus Client ที่ Backend
```bash
cd app/backend
npm install prom-client
```

### 2. ติดตั้ง Prometheus Stack
```bash
helm upgrade --install prometheus prometheus-community/kube-prometheus-stack -f values.yaml
```

### 3. สั่ง Prometheus ให้รู้จักแอป
```bash
kubectl apply -f servicemonitor.yaml
```

### 4. เปิดช่องทางเข้าถึง (Port-Forward)

**Terminal 1 - Grafana:**
```bash
kubectl port-forward svc/prometheus-grafana 3000:80
```

**Terminal 2 - Backend Metrics:**
```bash
kubectl port-forward svc/todo-service 8000:8000
```

**Terminal 3 - Public Access (ถ้าต้อง):**
```bash
ngrok http 8080
```

### 5. Demo & Verify
1. เพิ่ม/ลบ/แก้ Task ในแอปเร็วๆ เพื่อ generate data
2. เข้า http://localhost:8000/metrics ดูตัวเลข
3. ดู Grafana (http://localhost:3000) ตรวจเห็นกราฟขยับแบบ Real-time

✅ **สรุป**: Backend + Push Git → Build Pipeline → Port-Forward → ดู Metrics & Grafana
