FROM node:latest

RUN apt-get update && apt-get install vim procps -y 

COPY srcs srcs

WORKDIR srcs

RUN chmod +x setup.sh 

CMD ["./setup.sh"]