#!/bin/bash

cd ../../videoservice

# Taken from ../../videoservice/index.sh
# Killing VLC is ridicolous and literally requires kill -9
# And pump the nasty output into /dev/null
{
  kill -9 $(ps aux | grep VLC | awk '{print $2}')
} &> /dev/null

echo "Vlc has been killed."

bash index.sh 6969