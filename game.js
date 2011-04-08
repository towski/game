/*globals Crafty */

//setup the Crafty game with an FPS of 50 and stage width
//and height

Crafty.init(50, 1000, 800);
Crafty.canvas();

Crafty.c('SpaceFlight', {
    init: function() {
        this._vector = { x: 0, y: 0 };

        this.bind('enterframe', function() {
            this.x += this._vector.x;
            this.y += this._vector.y;
        });
    },
    accelerate: function(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }
});

Crafty.c('CustomControls', {
  __move: {left: false, right: false, up: false, down: false},
  _speed: 3,
  CustomControls: function(speed) {
    if (!this.has('controls')) {
        this.addComponent('controls');
    }
    if (speed) this._speed = speed;
    var move = this.__move;
    this.bind('enterframe', function() {
      // Move the player in a direction depending on the booleans
      // Only move the player in one direction at a time (up/down/left/right)
      if (move.right) this.x += this._speed;
      else if (move.left) this.x -= this._speed;
      else if (move.up) this.y -= this._speed;
      else if (move.down) this.y += this._speed;
    }).bind('keydown', function(e) {
      // Default movement booleans to false
      move.right = move.left = move.down = move.up = false;
      // If keys are down, set the direction
      if (e.keyCode === Crafty.keys.RA) move.right = true;
      if (e.keyCode === Crafty.keys.LA) move.left = true;
      if (e.keyCode === Crafty.keys.UA) move.up = true;
      if (e.keyCode === Crafty.keys.DA) move.down = true;
      this.preventTypeaheadFind(e);
    }).bind('keyup', function(e) {
      // If key is released, stop moving
      if (e.keyCode === Crafty.keys.RA) move.right = false;
      if (e.keyCode === Crafty.keys.LA) move.left = false;
      if (e.keyCode === Crafty.keys.UA) move.up = false;
      if (e.keyCode === Crafty.keys.DA) move.down = false;
      this.preventTypeaheadFind(e);
    });
    return this;
  }
});

Crafty.c('Losable', {
    init: function() {
        this.bind('enterframe', function() {
            if (this.x < 0 - this.w || this.x > Crafty.viewport.width || this.y < 0 - this.h || this.y > Crafty.viewport.height) {
                Crafty.scene('gameover');
            }
        });
    }
});

Crafty.c('Deadly', {
    init: function() {
        this.onhit('guy', function() {
            Crafty.scene('gameover');
        });
    }
});

Crafty.c('Edible', {
    init: function() {
        this._promise = jQuery.Deferred();

        this.onhit('guy', function() {
            this.destroy();
            this._promise.resolve();
        }).onhit('Deadly', function() {
            this.destroy();
            this._promise.resolve();
        });
    },
    onEaten: function(callback) {
        this._promise.done(callback);
        return this;
    }
});

Crafty.c('massive', {
    mass: function(mass) {
        var rock = this;

        function distance(other) {
            var x = rock.x - other.x,
                y = rock.y - other.y;
            return Math.sqrt(x * x + y * y);
        }

        function vecMult(scalar, vec) {
            return {
                x: vec.x * scalar,
                y: vec.y * scalar
            };
        }

        function unit(other) {
            var dist = distance(other);
            return {
                x: (other.x - rock.x) / dist,
                y: (other.y - rock.y) / dist
            };
        }

        this.bind('enterframe', function() {
            Crafty('SpaceFlight').each(function() {
                var guy = this,
                    dist = distance(guy),
                    u = unit(guy),
                    accel = vecMult(0 - mass / (dist * dist), u);

                guy.accelerate(accel);
            });
        });
    }
});

Crafty.sprite(32, 'man.png', {
    man: [0,0,0,2],
    back: [0,6,0,2]
});

Crafty.sprite(32, 'girl.png', {
    girl: [0,0,0,2]
});

function makeGuy() {
    var guy = Crafty.e('2D, canvas, guy, man, collision, CustomControls, animate, Losable')
        .attr({ x: Crafty.viewport.width / 2, y: Crafty.viewport.height / 2, w: 25, h: 50 })
        .animate("walk_down",  0, 0, 3)
        .animate("walk_left",  0, 2, 3)
        .animate("walk_right", 0, 4, 3)
        .animate("walk_up",    0, 6, 3)
        .CustomControls(3)
        .bind("enterframe", function(e) {
          if (this.__move.left) {
            if (!this.isPlaying("walk_left"))
              this.stop().animate("walk_left", 10);
          }
          if (this.__move.right) {
            if (!this.isPlaying("walk_right"))
              this.stop().animate("walk_right", 10);
          }
          if (this.__move.up) {
            if (!this.isPlaying("walk_up"))
              this.stop().animate("walk_up", 10);
          }
          if (this.__move.down) {
            if (!this.isPlaying("walk_down"))
              this.stop().animate("walk_down", 10);
          }
        }).bind("keyup", function(e) {
          this.stop();
        }).collision()
        .onhit("girl", function(){
          Crafty.scene('gameover');
          makeLargeGirl();
          makeLargeGuy();
          new Crafty.polygon([10,10],[50,50],[10,100],[50,100]);
        });
    return guy;
}

function makeGirl() {
  var girl = Crafty.e('2D, canvas, girl, collision')
      .attr({ x: (Crafty.viewport.width / 2) + 100, y: (Crafty.viewport.height / 2) + 100, w: 25, h: 50 })
  return girl;
}

function makeRock() {
    var rock = Crafty.e('2D, canvas, color, rock, collision, Deadly')
        .attr({ x: 30, y: 30, w: 200, h: 30 })
        .color('#123');
    return rock;
}

function makeLargeGirl() {
  var girl = Crafty.e('2D, canvas, girl, collision')
      .attr({ x: (Crafty.viewport.width / 2), y: 100, w: 100, h: 200 })
  return girl;
}

function makeLargeGuy() {
  var boy = Crafty.e('2D, canvas, back, collision')
      .attr({ x: (Crafty.viewport.width / 2) - 100, y: (Crafty.viewport.height - 400), w: 150, h: 300 })
  return boy;
}

function makeFood() {
    var food = Crafty.e('2D, canvas, color, collision, Edible, SpaceFlight')
        .attr({
            x: Crafty.randRange(10, Crafty.viewport.width - 10),
            y: Crafty.randRange(10, Crafty.viewport.height -10),
            w: 5, h: 5
        })
        .color('#f00')
        .onEaten(makeFood)
        .accelerate({
            x: 0.5 - (Math.random() * 1.0),
            y: 0.5 - (Math.random() * 1.0)
        });
    return food;
}

Crafty.scene("loading", function() {
    Crafty.load(['man.png'], function() {
        Crafty.scene('main');
    });

    Crafty.background('#fff');
    Crafty.e('2D, DOM, text').attr({w: 100, h: 20, x: 150, y: 120})
        .text('Loading...')
        .css({ 'text-align': 'center' });
});

Crafty.scene('gameover', function() {
    Crafty.e('2D, DOM, text').attr({ w: (Crafty.viewport.width / 2), h: (Crafty.viewport.height / 2), x: 150, y: 120 })
        .css({ 'text-align': 'center', 'color': '#000' });
});

Crafty.scene('main', function() {
    makeGuy();
    makeGirl();
    makeRock();
    makeFood();
});

Crafty.scene('loading');
