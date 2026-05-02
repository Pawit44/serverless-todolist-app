ลบไฟล์ออกจาก Git Cache (แต่ไม่ลบในเครื่อง)

# ถ้า .env อยู่ที่ root
git rm --cached .env

# หรือถ้า .env อยู่ในโฟลเดอร์ backend
git rm --cached backend/.env