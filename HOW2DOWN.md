🛑 How to Shut Down System
ขั้นตอนการปิดระบบทั้งหมดเพื่อคืนทรัพยากร (RAM/CPU) ให้เครื่องคอมพิวเตอร์อย่างถูกวิธี

1. ปิดแอปพลิเคชัน (Development Mode)
หากมีการรันแอปพลิเคชันทิ้งไว้ด้วย Docker Compose ปกติ ให้ใช้คำสั่ง:

```Bash
docker compose down
2. ปิดระบบอัตโนมัติ (Jenkins Server)
```
สั่งหยุดการทำงานของเซิร์ฟเวอร์ Jenkins:

```Bash
docker compose -f docker-compose.jenkins.yml down
```
3. ล้างทรัพยากรใน Kubernetes (Optional)
หากต้องการลบ Pods และ Services ทั้งหมดที่รันอยู่ใน Kubernetes:

```Bash
kubectl delete -f k8s/
```
หมายเหตุ: หากต้องการให้ระบบคงอยู่เพื่อเปิดมาใช้งานต่อทันทีในครั้งหน้า สามารถข้ามขั้นตอนนี้ได้

4. ปิดการทำงานของ Docker Engine
คลิกขวาที่ไอคอน Docker Desktop ใน System Tray (มุมขวาล่างของจอ)

เลือก Quit Docker Desktop

สรุปสถานะหลังปิดระบบ:

Code: ปลอดภัยอยู่ในเครื่องและ GitHub

Images: ถูกจัดเก็บไว้บน Docker Hub เรียบร้อยแล้ว

Resources: คืนค่า RAM และ CPU ให้เครื่องคอมพิวเตอร์ 100%