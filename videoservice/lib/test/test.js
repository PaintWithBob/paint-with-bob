// Assertion
const assert = require('assert');

// Require our server
const paintWithBobVideoServer = require('../server.js');

const SERVER_TIMEOUT = 3000;

describe('Paint With Bob Video Service', () => {
  it('Should be able to start and stop', function(done) {

    // Timeout so the test doesn't fail too early
    this.timeout(SERVER_TIMEOUT + 500);

    // Initialize and start our stream
    paintWithBobVideoServer.initialize('../droppy/files', 'paint-with-bob-test', 8069);
    paintWithBobVideoServer.startStream();

    // Timeout, close the server, and simply pass the test
    // If no errors occured, we should be good! :)
    setTimeout(() => {
      paintWithBobVideoServer.stopStream();
      assert.equal(true, true);
      done();
    }, SERVER_TIMEOUT);
  });
})
