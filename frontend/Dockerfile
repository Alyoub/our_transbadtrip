FROM node:latest

RUN apt-get update && apt-get install vim procps  -y 

COPY files files

CMD ["tail","-f","/dev/null"]
