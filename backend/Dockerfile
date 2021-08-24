FROM node:12.22

WORKDIR /paim1863-backend/

COPY package.json .

RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
