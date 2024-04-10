FROM node:18-slim
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm install --platform=linux --arch=x64 sharp
EXPOSE 3000

CMD ["npm", "start"]