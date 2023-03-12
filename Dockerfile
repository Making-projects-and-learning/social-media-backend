FROM node:18

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm i -g typescript

COPY . .

EXPOSE 8080

RUN npm run build

CMD ["npm", "run", "start"]
