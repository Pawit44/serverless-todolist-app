# 🛑 How to Shut Down System

ขั้นตอนการปิดระบบทั้งหมดเพื่อคืนทรัพยากร (RAM/CPU) ให้เครื่องคอมพิวเตอร์อย่างถูกวิธี

## 1. ปิดแอปพลิเคชัน (Development Mode)

หากมีการรันแอปพลิเคชันทิ้งไว้ด้วย Docker Compose ปกติ ให้ใช้คำสั่ง:

```bash
docker compose down
```

## 2. ปิดระบบอัตโนมัติ (Jenkins Server)

สั่งหยุดการทำงานของเซิร์ฟเวอร์ Jenkins:

```bash
docker compose -f docker-compose.jenkins.yml down
```

## 3. ล้างทรัพยากรใน Kubernetes (Optional)

หากต้องการลบ Pods และ Services ทั้งหมดที่รันอยู่ใน Kubernetes:

```bash
kubectl delete -f k8s/
```

**หมายเหตุ**: หากต้องการให้ระบบคงอยู่เพื่อเปิดมาใช้งานต่อทันทีในครั้งหน้า สามารถข้ามขั้นตอนนี้ได้

## 4. ปิดการทำงานของ Docker Engine

คลิกขวาที่ไอคอน Docker Desktop ใน System Tray (มุมขวาล่างของจอ)

เลือก **Quit Docker Desktop**

---

## 5. ลบทุกอย่างใน Kubernetes (แอป + ฐานข้อมูล + Monitoring)

รันคำสั่งเหล่านี้เพื่อเคลียร์ Resource ใน Cluster:

```bash
# ลบ Monitoring (Prometheus & Grafana)
helm uninstall prometheus

# ลบแอปและ ServiceMonitor
kubectl delete -f deployment.yaml,service.yaml,servicemonitor.yaml

## 6. ลบ Jenkins (Container)

จากภาพ `docker ps` ของคุณ Jenkins รันอยู่ในชื่อ `serverless-project-practice-jenkins-1` ให้ใช้คำสั่ง Docker เพื่อหยุดและลบ:

```bash
# หยุดการทำงาน
docker stop serverless-project-practice-jenkins-1

# ลบ Container ทิ้ง
docker rm serverless-project-practice-jenkins-1
```

> ถ้าคุณรันผ่าน Docker Compose สามารถไปที่โฟลเดอร์ที่มีไฟล์ `docker-compose.yml` แล้วใช้คำสั่ง `docker compose down` แทนได้ครับ

## 7. ตรวจสอบความสะอาด

หลังจากรันเสร็จ ลองเช็คอีกรอบ:

```bash
docker ps
```

ตอนนี้ Container ยั้วเยี้ยในลิสต์ของคุณควรจะหายไปทั้งหมดแล้วเครื่องจะกลับมาโล่ง 100% พร้อมสำหรับการรันใหม่ในครั้งหน้า

⚠️ คำเตือนสุดท้าย:

- Jenkins: ถ้าคุณไม่ได้ทำ Volume Mount ไว้ ข้อมูล Job หรือ Pipeline ที่ตั้งค่าไว้ใน Jenkins จะหายไป
- Database: ข้อมูล Todo ที่เคยกรอกไว้จะหายเกลี้ยงเพราะเราลบ PVC ไปแล้ว

ถ้ามั่นใจว่า Backup Dashboard JSON และ Push Code ขึ้น Git หมดแล้ว... กดรันได้เลยครับ! สะอาดแน่นอน 🧹✨

---

## สรุปสถานะหลังปิดระบบ

- **Code**: ปลอดภัยอยู่ในเครื่องและ GitHub
- **Images**: ถูกจัดเก็บไว้บน Docker Hub เรียบร้อยแล้ว
- **Resources**: คืนค่า RAM และ CPU ให้เครื่องคอมพิวเตอร์ 100%