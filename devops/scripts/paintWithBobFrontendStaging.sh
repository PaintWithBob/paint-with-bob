#!/bin/bash

# Script to do frontend staging deployments
# This must be run inside the project `devops/systemctlServices` folder

cd ../../frontend

rm package-lock.json

npm install

ng build --environment=stage 
