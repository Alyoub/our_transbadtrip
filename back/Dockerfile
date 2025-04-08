FROM node:23.9.0

RUN apt-get update && apt-get install -y vim procps

COPY srcs/package.json /srcs/package.json
COPY srcs/src/ srcs/src/
COPY srcs/server.js srcs/server.js 
COPY srcs/prisma/schema.prisma  srcs/prisma/schema.prisma
COPY srcs/setup.sh srcs/setup.sh 
# COPY srcs/uploads/ srcs/uploads/

WORKDIR /srcs

EXPOSE 3000

RUN chmod +x setup.sh

CMD ["./setup.sh"]

# CMD ["tail","-f","/dev/null"]