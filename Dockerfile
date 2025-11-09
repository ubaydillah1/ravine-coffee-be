FROM node:22-alpine

ENV NODE_ENV production

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN npm run build 

EXPOSE 5000

CMD ["npm", "run", "start"]