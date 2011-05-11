/**
 * Redis tracker
 * Router module
 *
 * This file is part of mapchat released under Apache License, Version 2.0.
 * See the NOTICE for more information.
 */

var connect = require('connect'),
    tracker = require('../tracker'),
    qs = require('querystring');

var router = exports;

/**
 * Class @constructor
 */
var Router = router.Router = function(options) {
  this.options = options = tracker.utils.merge({
    announceUrl: '/ann'
  }, options);
  this.announcer = tracker.createAnnouncer(options);

  var that = this;

  return connect.router(function(app) {
    app.get(options.announceUrl, function(req, res, next) {
      that.handler(req, res, next);
    });
  });
};

router.createRouter = function(options) {
  return new Router(options);
};

/**
 * Request handler
 */
Router.prototype.handler = function(req, res, next) {
  var that = this;
  function serverError(err) {
    res.writeHead(500);
    res.end(err);
  };

  this.validator(req, res, function(err, valid) {
    if (err) return serverError(err);

    if (!valid) return next();

    var params = {
      info_hash: tracker.utils.escapeBinary(req.query.info_hash),
      peer_id: req.query.peer_id,
      peer: tracker.utils.escapePeer(
        req.connection.remoteAddress,
        req.query.port
      ),
      numwant: parseInt(req.query.numwant)
    };

    that.announcer.announce(params, function(err, result) {
      if (err) return serverError(err);

      res.writeHead(200);
      res.write([
        'd8:intervali',
        result.interval,
        'e5:peers',
        result.peers.length * 6,
        ':'
      ].join(''));

      result.peers.forEach(function(peer, i) {
        res.write(tracker.utils.unescapePeer(peer));
      });

      res.end('e');
    });
  });
};

/**
 * Request validator
 */
Router.prototype.validator = function(req, res, callback) {
  var match = req.url.match(/\?(.*)$/);

  if (match === null) return callback(null, false);

  var query = req.query = qs.parse(match[1]);

  if (!query.info_hash || !query.port) return callback(null, false);
  if (!query.compact || !query.numwant) return callback(null, false);

  callback(null, true);
};
