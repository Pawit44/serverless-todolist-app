FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# Build Next.js
RUN npm run build
# เปิดพอร์ตที่ Next.js ใช้ (ปกติคือ 3000)
EXPOSE 3000
CMD [ "npm", "start" ]