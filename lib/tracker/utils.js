/**
 * Redis tracker
 * Utils
 *
 * This file is part of mapchat released under Apache License, Version 2.0.
 * See the NOTICE for more information.
 */

var Buffer = require('buffer').Buffer;

var utils = exports;

var merge = utils.merge = function(a, b) {
  var c = {};
  if (a) {
    for (var i in a) {
      if (a.hasOwnProperty(i)) {
        c[i] = a[i];
      }
    }
  }

  if (b) {
    for (var i in b) {
      if (b.hasOwnProperty(i)) {
        c[i] = typeof c[i] === 'object' ?
            merge(c[i], b[i])
            :
            b[i];
      }
    }
  }

  return c;
};

utils.parseIP = function(ip) {
  return ip.split('.').map(function(i) {
    return parseInt(i);
  });
};

utils.escapeBinary = function(b) {
  return (new Buffer(b)).toString('base64');
};

utils.escapePeer = function(ip, port) {
  port = parseInt(port);
  ip = utils.parseIP(ip);

  var buff = new Buffer([
    ip[0], ip[1], ip[2], ip[3],
    port >> 8, port & 255
  ]);

  return buff.toString('base64');
};

utils.unescapePeer = function(peer) {
  return new Buffer(peer, 'base64');
};
