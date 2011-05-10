/**
 * Redis tracker
 * Announcer module
 *
 * This file is part of mapchat released under Apache License, Version 2.0.
 * See the NOTICE for more information.
 */

var redis = require('redis'),
    tracker = require('../tracker');

var announcer = exports;

/**
 * Class @constructor
 */
var Announcer = announcer.Announcer = function(options) {
  this.options = options = tracker.utils.merge(options, {
    interval: 90,
    gcInterval: 300,
    redis: {
    }
  });

  this.db = redis.createClient(options.redis.port, options.redis.host);

  if (options.redis.auth) {
    this.db.auth(options.redis.auth);
  }
};

announcer.createAnnouncer = function(options) {
  return new Announcer;
};

/**
 * Announce peer
 */
Announcer.prototype.announce = function(params, callback) {
  var key = ['rtracker:pl:', params.info_hash].join(''),
      now = +new Date,
      interval = this.options.interval;

  this.db.zadd(key, now + this.options.gcInterval * 1e3,
               params.peer, function() {
  });

  this.db.zremrangebyscore(key, '-inf', now, function() {
  });

  this.db.expire(key, this.options.gcInterval, function() {
  });
  this.db.zrange(key, 0, params.numwant - 1, function(err, peers) {
    callback(null, {
      interval: interval,
      peers: peers
    });
  });
};
