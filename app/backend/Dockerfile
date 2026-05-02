# ใช้ Node.js version เป็นตัวตั้งต้น (แนะนำ Alpine เพราะขนาดเล็ก)
FROM node:18-alpine

# กำหนดโฟลเดอร์ทำงานใน Container
WORKDIR /usr/src/app

# ก๊อปปี้ไฟล์ package.json และ package-lock.json มาก่อน
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# ก๊อปปี้โค้ดทั้งหมดตามเข้ามา
COPY . .

# เปิดพอร์ตที่ Backend ของคุณใช้ (สมมติว่าใช้พอร์ต 5000)
EXPOSE 5000

# คำสั่งสำหรับรันแอป (เช็คใน package.json ว่าคุณรันด้วยคำสั่งอะไร)
CMD [ "npm", "start" ]