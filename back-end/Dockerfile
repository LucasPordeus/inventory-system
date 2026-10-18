FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY . .

RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup \
    && chown -R nodeuser:nodegroup /usr/src/app

USER nodeuser

EXPOSE 3000

CMD ["node", "src/server.js"]
