/**
 * @class nodewindows
 * This is a standalone module, originally designed for internal use in [NGN](http://github.com/thinkfirst/NGN).
 * However; it is capable of providing the same features for Node.JS scripts
 * independently of NGN.
 *
 * ### Getting flun-windows
 *
 * `npm install -g flun-windows`
 *
 * ### Using flun-windows
 *
 * `var nw = require('flun-windows');`
 *
 * @singleton
 * @author Corey Butler
 */
if (require('os').platform().indexOf('win32') < 0) {
  throw 'flun-windows is only supported on Windows.';
}

// Add binary invokers
module.exports = require('./lib/binaries');

// Add command line shortcuts
var commands = require('./lib/cmd');
for (var item in commands) {
  module.exports[item] = commands[item];
}

// Add daemon management capabilities
module.exports.Service = require('./lib/daemon');
module.exports.EventLogger = require('./lib/eventlog');