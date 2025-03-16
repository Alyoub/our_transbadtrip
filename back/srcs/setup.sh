#! /bin/bash 

npm i

npx prisma migrate dev --name init --legacy-peer-deps


node server.js