#!/bin/bash

# redirect stdout/stderr to a file
exec &> restartAll.log

# Echo Some Spacing

echo " "
echo " "
echo " "

date

echo " "

echo "Script starting up..."

echo " "

echo "Pulling latest master..."

git pull origin master

echo " "

echo "Restarting Paint with bob services..."

# Requires Aaron's dotfiles :p
sudo /bin/systemctl restart paintWithBobFrontendNgServe.service
sudo /bin/systemctl restart paintWithBobBackend.service
sudo /bin/systemctl restart paintWithBobStream.service

echo " "

echo "Done!"

echo " "
echo " "
echo " "
