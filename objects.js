Player = function(config){  
  this.initialize(config);
}

Player.prototype = {
  initialize: function(config){
    this.esteem = 50;
    this.lines;
  },
  glance: function(girl){
    var response = girl.respondToGlance(this);
    this.esteem += response['esteem'];
    return response.line;
  }
}

Girl = function(config){
  this.initialize(config);
}

Girl.prototype = {
  initialize: function(config){
    this.esteem = config;
    this.lines;
  },
  respondToGlance: function(player){
    return {line: "She doesn't seem to notice", esteem: -1}
  }
}
