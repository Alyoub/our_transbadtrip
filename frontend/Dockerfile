FROM node:latest

RUN apt-get update && apt-get install vim procps  -y

WORKDIR app

EXPOSE 3000

COPY server.js server.js

COPY files files

RUN npm install express 

CMD ["node","server.js"]

