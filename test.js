var assert = require('assert');
require('./objects.js')
var player = new Player()
var girl = new Girl();
assert.equal("She doesn't seem to notice", player.glance(girl));
