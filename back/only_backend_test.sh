#!/bin/bash

docker build -t backend_test .

docker run --env-file .env -p 3000:3000 --privileged -it -d backend_test