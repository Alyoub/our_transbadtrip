#! /bin/bash

npm i

npx tailwindcss -i ./src/styles/main.css -o ./src/styles/output.css --watch &

nohup npx tsc --watch &

python3 -m http.server 
