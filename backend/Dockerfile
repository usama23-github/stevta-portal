FROM node:20-alpine

RUN apk add --no-cache tzdata

ENV TZ=Asia/Karachi

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]