#! /bin/bash

npm i

npx tailwindcss -i ./src/styles/main.css -o ./src/styles/output.css --watch &

npx tsc --watch &

python3 -m http.server 

