#! /bin/bash 

npm i

npx prisma migrate dev --name init


node server.js