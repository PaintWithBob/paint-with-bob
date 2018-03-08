#!/bin/bash

# Script to do frontend staging deployments
# This must be run inside the project `devops/systemctlServices` folder

cd ../../frontend

rm package-lock.json

npm install

ng serve --host=0.0.0.0 --environment=stage --port=6971 --watch=false --live-reload=false --disable-host-check
