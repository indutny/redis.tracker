/**
 * Redis tracker
 *
 * This file is part of mapchat released under Apache License, Version 2.0.
 * See the NOTICE for more information.
 */

var tracker = exports;

// Import utils
tracker.utils = require('./tracker/utils');

// Import announcer lib
tracker.createAnnouncer = require('./tracker/announcer').createAnnouncer;
tracker.Announcer = require('./tracker/announcer').Announcer;

// Import router lib
tracker.createRouter = require('./tracker/router').createRouter;
tracker.Router = require('./tracker/router').Router;

// Import server lib
tracker.createServer = require('./tracker/server').createServer;
tracker.Server = require('./tracker/server').Server;
