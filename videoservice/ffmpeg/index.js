// Our dependencies
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const gradient = require('gradient-string');
const argv = require('minimist')(process.argv.slice(2));
const ffmpeg = require('fluent-ffmpeg');
const NodeMediaServer = require('node-media-server');

console.log(gradient('blue', 'green', 'red', 'cyan', 'purple', 'pink')(`
Paint With Bob Video Service
Paint With Bob Video Service
Paint With Bob Video Service
Paint With Bob Video Service
Paint With Bob Video Service
`));

// Get all of the mp4 files in the video directory
// Get all test roms for the directory
// TODO: Grab this from CLI
const videoFilePaths = fs.readdirSync('../videos');
const videos = videoFilePaths.filter((file) => {
    return path.extname(file).toLowerCase() === '.mp4';
});

// Define our event handlers for ffmpeg
const ffmpegStartNewVideo = () => {
  // ffmpeg -re -i INPUT_FILE_NAME -c copy -f flv rtmp://localhost/live/STREAM_NAME
  const ffmpegCommand = ffmpeg(`../videos/${videos[Math.floor(Math.random() * videos.length)]}`)
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
    .save('rtmp://localhost/live/STREAM_NAME');
};

const ffmpegOnEnd = () => {
  console.log('[PAINT WITH BOB]: done processing input stream');
  ffmpegStartNewVideo();
};

const ffmpegOnError = (error) => {
  console.log('an error happened: ' + error.message);
  process.exit(1);
};

// Timeout to ensure the server starts running before trying to stream to it
setTimeout(() => {
  ffmpegStartNewVideo();
}, 1000);

// Start our live stream serve
const nodeMediaServerConfig = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
};
var nodeMediaServer = new NodeMediaServer(nodeMediaServerConfig);
nodeMediaServer.run();
