// Public CLI like node file

// Our dependencies
const chalk = require('chalk');
const gradient = require('gradient-string');
const figlet = require('figlet');

// Require our server
const paintWithBobVideoServer = require('./server.js');

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

paintWithBobVideoServer.initialize(VIDEO_DIRECTORY, STREAM_NAME, PORT);
paintWithBobVideoServer.startStream();
