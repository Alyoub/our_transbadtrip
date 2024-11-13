FROM debian:latest


RUN apt-get update -y && apt-get install vim procps iputils-ping postgresql  -y

COPY setup.sh setup.sh

RUN chmod +x setup.sh && ./setup.sh

CMD ["tail","-f","/dev/null"]