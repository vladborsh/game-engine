;(function() {


  var Game = (function(){
    
    function Game( w, h ) {
      this.canvas        = document.createElement("canvas"),
      this.canvas.width  = w || window.innerWidth;
      this.canvas.height = h || window.innerHeight;
      this.context       = this.canvas.getContext("2d");
      this.worldList     = [];
      this.screen        = new Screen( this.canvas.width, this.canvas.height );
      this.cursor        = new Cursor( this.screen.center.x, this.screen.center.y );
      this.state         = new GameState();
      this.cursor.setListener( this.canvas );
      document.body.insertBefore( this.canvas, document.body.childNodes[0] );
    }

    Game.prototype.loop = function () {
      var self = this;
      var loopId = setInterval(function() {
        self.camera.change();
        self.calculateCursorAngle();
        console.log(self.cursor.angle);
        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
        for(var i = 0; i < self.worldList.length; i++) {
          self.worldList[i].change();
        }
        for(var i = 0; i < self.worldList.length; i++) {
          self.worldList[i].draw(
            self.context, 
            self.camera, 
            i == self.worldList.length-1, 
            self.cursor
          );
        }
      }, 17);
      //clearInterval(loopId);
    }

    Game.prototype.addObject = function( obj ) {
      this.worldList.unshift(obj);
    }

    Game.prototype.calculateCursorAngle = function () {
      var dy = this.screen.center.y - this.cursor.vector.y,
          dx = this.screen.center.x - this.cursor.vector.x;
      var k = dy / dx;
      this.cursor.angle = Math.atan2( dy, dx );
    }

    Game.prototype.setCamera = function( camera ) {
      this.camera = camera;
      this.camera.screen = this.screen;
    }

    Game.prototype.addCursorGameObject = function( sprite ) {
      var self = this;
      var _cursor = new GameObject(
        0, 0, 
        function(vector) {
          vector.x = self.cursor.getPosition().x;
          vector.y = self.cursor.getPosition().y;
        })
      _cursor.sprite = sprite;
      this.worldList.unshift(_cursor);
    }

    Game.prototype.setInputListener = function() {
      document.addEventListener("keydown", keyDownTextField, false);
    }

    return Game;

  }());

  /**
   * Game state class stores current pressed buttons
   */
  var GameState = (function() {
    
    function GameState(  ) {
      var self = this;
      this.top = false;
      this.left = false;
      this.right = false;
      this.bottom = false;
      this.mouseclick = false;
      document.addEventListener( "keydown",
        function( e ) {
          if ( e.keyCode == 87 ) self.top = true;
          if ( e.keyCode == 65 ) self.left = true;
          if ( e.keyCode == 83 ) self.bottom = true;
          if ( e.keyCode == 68 ) self.right = true;
        }, false 
      );
      document.addEventListener( "keyup",
        function( e ) {
          if ( e.keyCode == 87 ) self.top = false;
          if ( e.keyCode == 65 ) self.left = false;
          if ( e.keyCode == 83 ) self.bottom = false;
          if ( e.keyCode == 68 ) self.right = false;
        }, false 
      );
      document.addEventListener( "onmousedown", 
        function( e ) {
          self.mouseclick = true;
        }, false 
      );
      document.addEventListener( "onmouseup", 
        function( e ) {
          self.mouseclick = false;
        }, false
      );
      document.addEventListener('contextmenu', event => event.preventDefault());
    }

    return GameState;

  }())


  /**
   * Screen class represents screen object
   */
  var Screen = (function() {

    function Screen( w, h ) {
      this.w       = w;
      this.h       = h;
      this.center = new a.Vector(Math.round(w/2), Math.round(h/2));
    }

    return Screen;

  }());


  /**
   * Cursor represents current cursor position
   */
  var Cursor = (function() {
    
    function Cursor(x, y, canvas) {
      this.vector = new a.Vector(x, y);
      if (canvas) {
        this.setListener(canvas);
      }
      this.rotationByCursor = false;
      this.angle = 0;
    }

    Cursor.prototype.setListener = function( canvas ) {
      var self = this;
      canvas.addEventListener('mousemove', function(evt) {
        var rect = canvas.getBoundingClientRect();
        self.vector.x = evt.clientX - rect.left;
        self.vector.y = evt.clientY - rect.top;
      }, false);
    }

    Cursor.prototype.getPosition = function() {
      return this.vector;
    }

    return Cursor;

  }());


  /**
   * GameObject class represents basic game object
   */
  var GameObject = (function() {

    function GameObject( x, y, conversion, gameState, sprite, controller ) {
      this.vector     = new a.Vector(x, y);
      this.conversion = conversion || (function(vector) { vector.translate(0, 0); });
      this.gameState  = gameState;
      this.sprite     = sprite;
      this.controller = controller;
      if (this.controller) this.controller.ownVec = this.vector;
    }

    GameObject.prototype.change = function() {
      if (this.sprite) this.sprite.next();
      this.conversion(this.vector, this.gameState, this.controller);
    }

    GameObject.prototype.draw = function( context, camera, isCursor, cursor ) {
      if (this.sprite) {
        this.sprite.draw(context, this.vector, camera, isCursor, cursor)
      }
    }

    return GameObject;

  }());


  /**
   * Camera class represents current camera position and conversion function. 
   */
  var Camera = (function(){

    function Camera( x, y, conversion, gameState, controller ) {
      this.vector = new a.Vector(x, y);
      this.conversion = conversion || (function(vector) { vector.translate(0, 0); });
      this.gameState  = gameState;
      this.controller = controller;
      if (this.controller) this.controller.ownVec = this.vector;
    }

    Camera.prototype.change = function() {
      this.conversion(this.vector, this.gameState, this.controller);
    }

    return Camera;

  }());


  var Sprite = (function() {

    function Sprite(source, w, h, duration, interval, firstFrame, animationLength, bounce) {
      this.source               = new Image();
      this.source.src           = source;
      this.w                    = w;
      this.h                    = h;
      this.duration             = duration;
      this.interval             = interval;
      this.animationLength      = animationLength;
      this.frameDuration        = Math.round(this.duration / this.interval / animationLength);
      this.currentFrameLifeTime = 0;
      this.firstFrame           = firstFrame;
      this.currentFrame         = this.firstFrame;
      this.reverse              = false;
      this.bounce               = bounce || false;
    }

    Sprite.prototype.next = function() {
      if ( this.currentFrameLifeTime == this.frameDuration ) {
        this.currentFrameLifeTime = 0;
        this.currentFrame += this.reverse ? -1 : 1;
      } else {
        this.currentFrameLifeTime++;
      }
      if ( this.currentFrame == this.animationLength - 1 ) { 
        if (this.bounce) {
          this.reverse = true;
        } else {
          this.currentFrame = 0;
        }
      } else if (this.currentFrame == 0 && this.reverse) {
        this.reverse = false;
      }
    }

    Sprite.prototype.draw = function(ctx, vector, camera, isCursor, cursor) {
      var self = this;
      var dx = 0, dy = 0;
      if (cursor.rotationByCursor && !isCursor) {
        dx = Math.cos(cursor.angle) * 100;
        dy = Math.sin(cursor.angle) * 100;
      }
      //console.log(cursor.vector.y - camera.screen.center.x, cursor.vector.y - camera.screen.center.x)
      ctx.drawImage(
        self.source, 
        self.currentFrame * self.w, 
        0, 
        self.w, 
        self.h, 
        vector.x - Math.round(self.w / 2) - (!isCursor ? Math.round(camera.vector.x - camera.screen.w / 2) : 0) + dx, 
        vector.y - Math.round(self.h / 2) - (!isCursor ? Math.round(camera.vector.y - camera.screen.h / 2) : 0) + dy, 
        self.w, 
        self.h
      );
    }

    return Sprite;

  }());


  var Controller = (function () {

    function Controller(v, a, state, accelerationBoost, maxVelocity, slipCoefficient, linkedVec) {
      this.velocity = v;
      this.acceleration = a;
      this.gameState = state;
      this.accelerationBoost = accelerationBoost;
      this.maxVelocity = maxVelocity;
      this.minVelocity = -maxVelocity;
      this.slipCoefficient = slipCoefficient;
      this.prevVelocity = v;
      this.linkedVec = linkedVec;
    }

    Controller.prototype.accelerate = function () {
      this.setAcceleration();
      this.velocity.x += 
        ((this.velocity.x < this.maxVelocity) && (this.velocity.x > this.minVelocity)) 
          ? this.acceleration.x : 0;
      this.velocity.y += 
        ((this.velocity.y < this.maxVelocity) && (this.velocity.y > this.minVelocity)) 
          ? this.acceleration.y : 0;
      this.absoluteStopMinVelocity()
      this.prevVelocity.x = this.velocity.x;
      this.prevVelocity.y = this.velocity.y;
      return this.velocity;
    }

    Controller.prototype.setAcceleration = function () {
      if (!this.linkedVec) {
        if (this.gameState.left) {
          this.acceleration.x = -this.accelerationBoost 
        } else if (this.gameState.right) {
          this.acceleration.x = this.accelerationBoost
        } else {
          this.acceleration.x = 0
        }
        if (this.gameState.top) {
          this.acceleration.y = -this.accelerationBoost 
        } else if (this.gameState.bottom) {
          this.acceleration.y = this.accelerationBoost
        } else {
          this.acceleration.y = 0
        }
      } else {
        if (this.linkedVec.x < this.ownVec.x) {
          this.acceleration.x = -this.accelerationBoost 
        } else if (this.linkedVec.x > this.ownVec.x) {
          this.acceleration.x = this.accelerationBoost
        } else {
          this.acceleration.x = 0
        }
        if (this.linkedVec.y < this.ownVec.y) {
          this.acceleration.y = -this.accelerationBoost 
        } else if (this.linkedVec.y > this.ownVec.y) {
          this.acceleration.y = this.accelerationBoost
        } else {
          this.acceleration.y = 0
        }
      }
    }

    Controller.prototype.absoluteStopMinVelocity = function () {
      if (this.velocity.x == this.prevVelocity.x && this.velocity.x != 0 && this.velocity.x < 1 && this.velocity.x > -1) this.velocity.x = 0; 
      if (this.velocity.y == this.prevVelocity.y && this.velocity.y != 0 && this.velocity.y < 1 && this.velocity.y > -1) this.velocity.y = 0;
    }

    Controller.prototype.slip = function () {
      this.velocity.x -= 
        (!this.gameState.right && this.velocity.x > 0) 
          ? this.slipCoefficient : 0;
      this.velocity.x -= 
        (!this.gameState.left && this.velocity.x < 0) 
          ? -this.slipCoefficient : 0;
      this.velocity.y -= 
        (!this.gameState.top && this.velocity.y < 0) 
          ? -this.slipCoefficient : 0;
      this.velocity.y -= 
        (!this.gameState.bottom && this.velocity.y > 0) 
          ? this.slipCoefficient : 0;
    }

    return Controller;

  }())


  window.e = {
    Game        : Game,
    Camera      : Camera,
    Screen      : Screen,
    GameObject  : GameObject,
    Sprite      : Sprite,
    Controller  : Controller
  }

}());
