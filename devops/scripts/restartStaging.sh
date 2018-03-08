#!/bin/bash

# redirect stdout/stderr to a file
exec &> restartStaging.log

# Echo Some Spacing

echo " "
echo " "
echo " "

date

echo " "

echo "Script starting up..."

echo " "

echo "Showing the current branch..."

CURRENT_GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "Current git branch: $CURRENT_GIT_BRANCH"

echo "Pulling latest of $CURRENT_GIT_BRANCH..."

git pull origin $CURRENT_GIT_BRANCH

echo " "

echo "Restarting Paint with bob services..."

sudo /bin/systemctl restart paintWithBobFrontendStaging
sudo /bin/systemctl restart paintWithBobBackendStaging
sudo /bin/systemctl restart paintWithBobStreamStaging

echo " "

echo "Done!"

echo " "
echo " "
echo " "
