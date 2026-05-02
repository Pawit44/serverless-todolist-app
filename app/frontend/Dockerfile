FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# Build Next.js
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build
# เปิดพอร์ตที่ Next.js ใช้ (ปกติคือ 3000)
EXPOSE 3000
CMD [ "npm", "start" ]