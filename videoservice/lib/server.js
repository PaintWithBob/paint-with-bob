// Video Server Application Logic

// Dependencies
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const NodeMediaServer = require('node-media-server');

// Our singleton variables
let IS_READY = false;
let VIDEO_DIRECTORY = '';
let STREAM_NAME = '';
let PORT = 8000;
let VIDEOS = [];
let NODE_MEDIA_SERVER = false;
let FFMPEG = false;

const initialize = (videoDirectory, streamName, port) => {

  // Check for required fields
  if(!videoDirectory) {
    console.log('You must pass a video directory to initialize.');
    return false;
  }

  if(videoDirectory.charAt(videoDirectory.length - 1) !== '/') {
    videoDirectory = videoDirectory + '/';
  }

  VIDEO_DIRECTORY = videoDirectory;
  if(streamName) {
    STREAM_NAME = streamName;
  }
  if(port) {
    PORT = port;
  }

  // Our available videos
  // Get all of the mp4 files in the video directory
  // Get all test roms for the directory
  const videoFilePaths = fs.readdirSync(VIDEO_DIRECTORY);
  VIDEOS = videoFilePaths.filter((file) => {
      return path.extname(file).toLowerCase() === '.mp4';
  });

  isReady = true;
  return true;
}

// Define our event handlers for ffmpeg
const ffmpegStartNewVideo = () => {
  // ffmpeg -re -i INPUT_FILE_NAME -c copy -f flv rtmp://localhost/live/STREAM_NAME
  const videoPath = `${VIDEO_DIRECTORY}${VIDEOS[Math.floor(Math.random() * VIDEOS.length)]}`;
  console.log(`Playing the video at: ${videoPath}`);
  FFMPEG = ffmpeg(videoPath)
    // .seekInput('27:20.000') Seek input for debugging
    .inputOptions('-re')
    .videoCodec('libx264')
    .audioCodec('copy')
    .format('flv')
    // setup event handlers
    .on('end', () => {
      ffmpegOnEnd();
    })
    .on('error', (error) => {
      ffmpegOnError(error)
    })
    .save(`rtmp://localhost/live/${STREAM_NAME}`);
};

const ffmpegOnEnd = () => {
  console.log('[PAINT WITH BOB]: done processing input stream');
  ffmpegStartNewVideo();
};

const ffmpegOnError = (error) => {
  console.log('an error happened: ' + error.message);
  process.exit(1);
};

const startStream = () => {
  // Create a node media server if we do not have one
  if(!NODE_MEDIA_SERVER) {
    // Our node media server
    const nodeMediaServerConfig = {
      rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 60,
        ping_timeout: 30
      },
      http: {
        port: PORT,
        allow_origin: '*'
      }
    };
    NODE_MEDIA_SERVER = new NodeMediaServer(nodeMediaServerConfig);
  }
  NODE_MEDIA_SERVER.run();

  // Timeout starting ffmpeg to ensure the server is up before streaming video to it
  setTimeout(() => {
    ffmpegStartNewVideo();
  }, 1000)
}

const stopStream = () => {
  if(FFMPEG) {
    FFMPEG.kill();
  }

  if(NODE_MEDIA_SERVER) {
    NODE_MEDIA_SERVER.stop();
  }

  FFMPEG = false;
  NODE_MEDIA_SERVER = false;
}

module.exports = {
  initialize: initialize,
  startStream: startStream,
  stopStream: stopStream
}
