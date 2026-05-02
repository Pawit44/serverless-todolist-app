ลบไฟล์ออกจาก Git Cache (แต่ไม่ลบในเครื่อง)

# ถ้า .env อยู่ที่ root
git rm --cached .env

# หรือถ้า .env อยู่ในโฟลเดอร์ backend
git rm --cached backend/.env

---
รัน Jenkins และปลดล็อกการใช้งาน
- เปิด Terminal ชี้ไปที่โฟลเดอร์โปรเจกต์ แล้วรันคำสั่งนี้เพื่อเปิด Jenkins ขึ้นมา (สังเกตว่าเราใช้ -f เพื่อระบุชื่อไฟล์ให้ถูกต้อง):

- docker compose -f docker-compose.jenkins.yml up --build -d
---

--- 
ดูรหัสผ่านชั่วคราว สำหรับปลดล็อก Jenkins
- docker compose -f docker-compose.jenkins.yml logs jenkins
--- 