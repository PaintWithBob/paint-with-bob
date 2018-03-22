#!/bin/bash


# Source our env file
source .env

cd ../../videoservice/lib

node index.js ../droppy/files -p 6969
