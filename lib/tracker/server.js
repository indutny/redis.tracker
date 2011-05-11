/**
 * Redis tracker
 * Server module
 *
 * This file is part of mapchat released under Apache License, Version 2.0.
 * See the NOTICE for more information.
 */

var connect = require('connect'),
    tracker = require('../tracker');

var server = exports;

/**
 * Class @constructor
 */
var Server = server.Server = function(options) {
  this.options = options = tracker.utils.merge({
    static: __dirname + '/../../pub'
  }, options);

  return connect(
    tracker.createRouter(options),
    connect.static(options.static)
  );
};

server.createServer = function(options) {
  return new Server(options);
};
