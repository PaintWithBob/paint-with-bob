#!/bin/bash


# Source our env file
source .env

cd ../../videoservice/lib

rm package-lock.json

npm install

node index.js ../droppy/files -p 6969
