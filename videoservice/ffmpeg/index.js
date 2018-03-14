// Our dependencies
const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));
const ffmpeg = require('fluent-ffmpeg');
const NodeMediaServer = require('node-media-server');

// ffmpeg -re -i INPUT_FILE_NAME -c copy -f flv rtmp://localhost/live/STREAM_NAME
setTimeout(() => {
  const ffmpegCommand = ffmpeg('../videos/season21Episode1.mp4')
    .inputOptions('-re')
    .videoCodec('libx264')
    .audioCodec('copy')
    .format('flv')
    // setup event handlers
    .on('end', () => {
      console.log('done processing input stream');
    })
    .on('error', (err) => {
      console.log('an error happened: ' + err.message);
    })
    .save('rtmp://localhost/live/STREAM_NAME');
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
