FROM node:latest

RUN apt-get update && apt-get install vim procps  -y

WORKDIR app

COPY package.json package.json

COPY package-lock.json package-lock.json

COPY server.js server.js

COPY files files

CMD ["node","server.js"]

