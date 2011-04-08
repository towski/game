sys = require('sys')

Player = function(config){  
  this.initialize(config);
}

Player.prototype = {
  initialize: function(config){
    this.attractiveness = 2;
    this.esteem = 50;
    this.lines;
  },
  glance: function(girl){
    var response = girl.respondToGlance(this);
    this.esteem += response['esteem'];
    return response.line;
  },
  talk: function(girl, line){
    var response = girl.talk(this, line);
    return response.line
  }
}

Girl = function(config){
  this.initialize(config);
}

Girl.prototype = {
  initialize: function(config){
    this.esteem = config.esteem || 50;
    this.attractiveness = config.attractiveness || 5;
    this.lines;
  },
  respondToGlance: function(player){
    return {line: "She doesn't seem to notice", esteem: -1}
  },
  talk: function(player, line){
    if(line.greeting){
      if(player.attractiveness > this.attractiveness && this.chance(0.5)){
        return {line: "Hi", esteem: 1};
      }else{
        return {line: "...", esteem: -1};
      }
    }else if(line.question) {
      if(player.attractiveness + 2 > this.attractiveness && this.chance(0.5)){
        this.comfortable = true;
        return {line: line.success, esteem: 1};
      }else{
        return {line: line.failure, esteem: -1};
      }
    }else if(line.ask_out) {
      if(player.attractiveness > this.attractiveness + 2 && this.comfortable && this.chance(0.25)){
        return {line: line.success, esteem: 1};
      }else{
        return {line: line.failure, esteem: -1};
      }
    }
  },
  chance: function(probability){
    var chance = Math.random();
    if(chance > probability){
      return true;
    }else{
      return false
    }
  }
}

Line = function(config){
  this.initialize(config);
}

Line.prototype = {
  initialize: function(config){
    this.line = config.line;
    this.greeting = config.greeting;
    this.question = config.question;
    this.success = config.success;
    this.failure = config.failure;
    this.ask_out = config.ask_out;
  }
}