#! /bin/bash 

docker build -t backend_test .

docker run --privileged -it -d backend_test 