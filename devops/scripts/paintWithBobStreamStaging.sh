#!/bin/bash


# Source our env file
source .env

cd ../../videoservice

node index.js droppy/files
