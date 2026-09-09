FROM node:24-alpine

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.cloud.tencent.com/g' /etc/apk/repositories \
  && apk add --no-cache python3 make g++
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --registry=https://mirrors.tencent.com/npm/

COPY . .
ENV NODE_ENV=production
RUN npm run build && npm prune --omit=dev

EXPOSE 1337
CMD ["npm", "run", "start"]
