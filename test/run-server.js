var tracker = require('../lib/tracker'),
    fugue = require('fugue');

var server = tracker.createServer();

fugue.start(server, 8081, null, 8);
