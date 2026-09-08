FROM node:24-alpine

RUN apk add --no-cache python3 make g++
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ENV NODE_ENV=production
RUN npm run build && npm prune --omit=dev

EXPOSE 1337
CMD ["npm", "run", "start"]
