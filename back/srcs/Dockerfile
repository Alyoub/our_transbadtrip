FROM debian:latest

RUN apt-get update && apt-get install vim procps -y 

COPY srcs srcs

RUN chmod +x srcs/setup.sh 

CMD ["node","sever.js"]