#!/bin/bash

cd ../../backend

rm package-lock.json

npm install

PORT=6970 forever bin/www
