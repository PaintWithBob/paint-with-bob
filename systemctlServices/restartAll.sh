#!/bin/bash

# redirect stdout/stderr to a file
exec &> restartAll.log

# Echo Some Spacing

echo " "
echo " "
echo " "

echo "Script starting up..."

echo "Pulling latest master..."

git pull origin master

echo "Restarting Paint with bob services..."

# Requires Aaron's dotfiles :p
sudo systemctl restart paintWithBobFrontendNgServe.service
sudo systemctl restart paintWithBobBackend.service
sudo systemctl restart paintWithBobStream.service

echo "Done!"

echo " "
echo " "
echo " "
