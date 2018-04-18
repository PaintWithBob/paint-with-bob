#!/bin/bash

# Script to do frontend staging deployments
# This must be run inside the project `devops/systemctlServices` folder

cd ../../frontend

rm package-lock.json

npm install

# https://github.com/angular/angular-cli/wiki/build

ng build --prod --environment=stage

# Copy the build output to public/ if successful build
if [ $? -eq 0 ]; then
   rm -rf public
   mkdir -p public
   cp -r dist/* public/
else
    echo "Failed Building the frontend"
fi
