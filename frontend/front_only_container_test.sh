#!/bin/sh

# Build the Docker image
docker build -t test .

# Run the container with port mapping and privileged mode
docker run --privileged -p 3000:3000 -it -d test

