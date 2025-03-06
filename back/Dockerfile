FROM node:latest

RUN apt-get update && apt-get install -y vim procps

COPY srcs/ /srcs

WORKDIR /srcs

EXPOSE 80

RUN chmod +x setup.sh

CMD ["./setup.sh"]