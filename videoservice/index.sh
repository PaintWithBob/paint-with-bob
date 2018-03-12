#!/bin/bash

# Video Service For serving videos

# Resources:

# https://www.reddit.com/r/asmr/comments/2tpgf7/legal_full_episodes_of_bob_ross_the_joy_of/
#
# https://stackoverflow.com/questions/31937420/live-streaming-rtmp-to-html5
#
# https://ubuntuforums.org/showthread.php?t=1806327
#
# http://www.wumpus-cave.net/2013/11/06/running-vlc-automatically-on-a-headless-raspberry-pi/
#
# https://wiki.videolan.org/Documentation:Streaming_HowTo/
#
# https://wiki.videolan.org/Documentation:Streaming_HowTo/Advanced_Streaming_Using_the_Command_Line/
#
# https://github.com/torch2424/piStreamRadio/blob/master/startStream.sh
#
# https://stackoverflow.com/questions/12771909/bash-using-trap-ctrlc

if [ "$#" -ne 1 ]; then
  # Echo Usage if not working
  echo " "
  echo "Paint with Bob Video Service USAGE"
  echo " "
  echo "./index.sh [Port number]"
else

  # Allow for CTRL+C to exit
  trap ctrl-c-handler SIGHUP SIGINT SIGTERM

  function ctrl-c-handler() {
    # Killing VLC is ridicolous and literally requires kill -9
    # And pump the nasty output into /dev/null
    {
      kill -9 $(ps aux | grep VLC | awk '{print $2}')
    } &> /dev/null

    echo "Vlc has been killed."
  }

  # Print our nice header
  ./printheader.sh

  echo " "
  echo "Video Stream started at: http://localhost:$1/stream.ogg"
  echo " "

  # Set our vlc depending on OS
  # https://gist.github.com/britzl/267a70d2cf144d651285
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # Vlc for osx
    vlc=/Applications/VLC.app/Contents/MacOS/VLC
  elif [[ "$OSTYPE" == "cygwin" ]]; then
          # POSIX compatibility layer and Linux environment emulation for Windows
          echo "TODO: Find path for cygwin"
  elif [[ "$OSTYPE" == "msys" ]]; then
          # Lightweight shell and GNU utilities compiled for Windows (part of MinGW)
          vlc="/c/Program\ Files/VideoLAN/VLC/vlc.exe"
  elif [[ "$OSTYPE" == "win32" ]]; then
          # I'm not sure this can happen.
          echo "TODO: Find path for win32"
  else
    vlc=cvlc
  fi

  # Run in background to stop it from catching and removing CTRL C catch
  # And wait for it to finish, or for ctrl c
  bash -c "\"$vlc\" --random --loop './videos/' --sout '#transcode{vcodec=theo,vb=800,scale=1,acodec=vorb,ab=128,channels=2,samplerate=44100}:http{mux=ogg,dst=:$1/stream.ogg}' --sout-keep" \
  & wait

  # Inform of exit
  echo "Stopping Stream... Have a nice day!"
fi
