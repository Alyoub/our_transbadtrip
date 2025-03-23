#! /bin/bash

npm i --legacy-peer-deps

npx prisma migrate dev --name init

node server.js

