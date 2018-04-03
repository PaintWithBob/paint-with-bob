// Our dependencies
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const gradient = require('gradient-string');
const figlet = require('figlet');
const ffmpeg = require('fluent-ffmpeg');
const NodeMediaServer = require('node-media-server');

// Set up our minimist CLI
const argv = require('minimist')(process.argv.slice(2), {
  string: ['port', 'secret', 'name'],
  boolean: ['help'],
  alias: {
    h: 'help',
    p: 'port',
    s: 'secret',
    n: 'name'
  },
});

// Function to print our usage
/**
* Function to print the CLI Usage
*/
const printUsage = () => {
  console.log(`

    See Node Media Server ( https://www.npmjs.com/package/node-media-server )
    For Urls and tools to use the video service

    Usage:
      node index.js [Video Directory] [OPTIONS]
      Options:
        -h, --help    Print usage information
        -n, --name    Name of the stream (protocol://localhost/live/NAME)
        -p, --port    Port to receive http connections (http://localhost:PORT/live/NAME)
  `);
  process.exit();
}

// Print the header
console.log('');
const fonts = figlet.fontsSync();

const paintWithBobHeader = figlet.textSync("Paint With Bob Video", {
  font: fonts[Math.floor(fonts.length * Math.random())]
});

console.log(gradient('blue', 'green', 'red', 'cyan', 'purple', 'pink')(paintWithBobHeader));
console.log('');

// Check our CLI Input
if (argv.help || argv._.length != 1) {
  printUsage();
}

// Get our variables from the CLI
let VIDEO_DIRECTORY = argv._[0];
if(VIDEO_DIRECTORY.charAt(VIDEO_DIRECTORY.length - 1) !== "/") {
  VIDEO_DIRECTORY = VIDEO_DIRECTORY + "/"
}
const STREAM_NAME = argv.name || 'paintwithbob-1';
const PORT = argv.port || '8000';

// Get all of the mp4 files in the video directory
// Get all test roms for the directory
const videoFilePaths = fs.readdirSync(VIDEO_DIRECTORY);
const videos = videoFilePaths.filter((file) => {
    return path.extname(file).toLowerCase() === '.mp4';
});

// Define our event handlers for ffmpeg
const ffmpegStartNewVideo = () => {
  // ffmpeg -re -i INPUT_FILE_NAME -c copy -f flv rtmp://localhost/live/STREAM_NAME
  const videoPath = `${VIDEO_DIRECTORY}${videos[Math.floor(Math.random() * videos.length)]}`;
  console.log(`Playing the video at: ${videoPath}`);
  const ffmpegCommand = ffmpeg(videoPath)
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
    port: PORT,
    allow_origin: '*'
  }
};
var nodeMediaServer = new NodeMediaServer(nodeMediaServerConfig);
nodeMediaServer.run();
