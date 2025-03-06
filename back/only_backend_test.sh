#!/bin/bash

docker build -t backend_test .

docker run -p 80:80 --privileged -it -d backend_test