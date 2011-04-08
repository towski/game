var assert = require('assert');
var sys = require('sys');
var nodeunit = require('nodeunit');
require('./objects.js')

exports['test1'] = nodeunit.testCase({
  'test1': function(test){
    player = new Player()
    girl = new Girl({attractiveness: 5});
    girl.chance = function(){ return true };
    assert.equal("She doesn't seem to notice", player.glance(girl));
    var line = new Line({line: "Hey", greeting: true});
    assert.equal("...", player.talk(girl, line));
    player.attractiveness = 6
    assert.equal("Hi", player.talk(girl, line));
    test.done();
  },

  'test2': function(test){
    player = new Player()
    girl = new Girl({attractiveness: 5});
    girl.chance = function(){ return true };
    var line2 = new Line({line: "Do you know where a burger place is?", question:true, success: "I think there's one up the street", failure: "Nope, sorry"});
    player.attractiveness = 1
    assert.equal("Nope, sorry", player.talk(girl, line2));
    player.attractiveness = 4
    assert.equal("I think there's one up the street", player.talk(girl, line2));
    test.done();
  },

  'test3': function(test){
    player = new Player()
    girl = new Girl({attractiveness: 5});
    girl.chance = function(){ return true };
    var line3 = new Line({line: "Wanna grab a burger?", ask_out:true, success: "Sure", failure: "...? No thanks"});
    player.attractiveness = 1
    assert.equal(line3.failure, player.talk(girl, line3));
    player.attractiveness = 7
    assert.equal(line3.failure, player.talk(girl, line3));
    test.done();
  }
});