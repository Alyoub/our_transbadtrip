FROM node:23.9.0

RUN apt-get update && apt-get install -y vim procps python3

COPY files files

WORKDIR /files 

EXPOSE 8000

RUN chmod +x setUp.sh

CMD ["./setUp.sh"]

# CMD ["tail","-f","/dev/null"]