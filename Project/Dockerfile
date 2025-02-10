# Dockerfile
FROM node:16-alpine

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и устанавливаем зависимости
COPY package.json package-lock.json ./
RUN npm install --production

# Копируем исходный код приложения
COPY . .

# Открываем порты приложения
EXPOSE 3000 8443

# Запускаем приложение
CMD ["npm", "start"]
