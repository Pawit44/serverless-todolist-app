# 🛑 ปิดระบบ (Shutdown)

ขั้นตอนการปิดระบบทั้งหมดอย่างถูกวิธี

## Step 1: ปิด Development Server (ถ้ามี)
```bash
docker compose down
```

## Step 2: ปิด Jenkins CI/CD
```bash
docker compose -f docker-compose.jenkins.yml down
```

## Step 3: ลบทรัพยากรใน Kubernetes

**ลบ Monitoring Stack:**
```bash
helm uninstall prometheus
```

**ลบแอปพลิเคชัน:**
```bash
kubectl delete -f deployment.yaml,service.yaml,servicemonitor.yaml
```

หรือ ลบทั้งหมด:
```bash
kubectl delete -f k8s/
```

## Step 4: ตรวจสอบและปิด Docker Desktop

**ยืนยันว่าทุกอย่างหายไป:**
```bash
docker ps
```

**ปิด Docker Desktop:**
- คลิกขวา Docker Desktop Icon → **Quit Docker Desktop**

---

## 📋 สรุปสถานะหลังปิด
- ✅ Code ปลอดภัยใน GitHub
- ✅ Docker Images เก็บไว้ที่ Docker Hub
- ✅ RAM/CPU คืนให้เครื่องสมบูรณ์