;(function() {


  var Game = (function(){
    
    function Game( w, h ) {
      this.canvas        = document.createElement("canvas"),
      this.canvas.width  = w || window.innerWidth;
      this.canvas.height = h || window.innerHeight;
      this.context       = this.canvas.getContext("2d");
      this.worldList     = [];
      this.screen        = new Screen( this.canvas.width, this.canvas.height );
      this.cursor        = new Cursor( this.screen.xCenter, this.screen.yCenter );
      this.cursor.setListener( this.canvas );
      this.state = new GameState();
      document.body.insertBefore( this.canvas, document.body.childNodes[0] );
    }

    Game.prototype.loop = function () {
      var self = this;
      var loopId = setInterval(function() {
        self.camera.change();
        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
        for(var i = 0; i < self.worldList.length; i++) self.worldList[i].change();
        for(var i = 0; i < self.worldList.length; i++) {
          self.worldList[i].draw(self.context, self.camera, i == self.worldList.length-1);
        }
      }, 17);
      //clearInterval(loopId);
    }

    Game.prototype.addObject = function( obj ) {
      this.worldList.unshift(obj);
    }

    Game.prototype.setCamera = function( camera ) {
      this.camera = camera;
    }

    Game.prototype.addCursorGameObject = function( sprite ) {
      var self = this;
      var _cursor = new GameObject(
        0, 0, 
        function(vector) {
          vector.x = self.cursor.getPosition().x;
          vector.y = self.cursor.getPosition().y;
        })
      _cursor.setSprite(sprite);
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
    
    function GameState() {
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
      this.xCenter = Math.round(w/2);
      this.yCenter = Math.round(h/2);
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

    function GameObject(x, y, conversion, gameState, sprite) {
      this.vector     = new a.Vector(x, y);
      this.conversion = conversion || (function(vector) { vector.translate(0, 0); });
      this.gameState  = gameState;
      this.sprite     = sprite;
    }

    GameObject.prototype.setConversionFuncion = function( func ) {
      this.conversion = func
    }

    GameObject.prototype.setSprite = function( sprite ) {
      this.sprite = sprite;
    }

    GameObject.prototype.change = function() {
      if (this.sprite) this.sprite.next();
      this.conversion(this.vector, this.gameState);
    }

    GameObject.prototype.draw = function(context, camera, isCursor) {
      if (this.sprite) {
        this.sprite.draw(context, this.vector, camera, isCursor)
      }
    }

    return GameObject;

  }());


  /**
   * Camera class represents current camera position and conversion function. 
   */
  var Camera = (function(){

    function Camera( x, y, conversion, gameState ) {
      this.vector = new a.Vector(x, y);
      this.conversion = conversion || (function(vector) { vector.translate(0, 0); });
      this.gameState  = gameState;
    }

    Camera.prototype.change = function() {
      this.conversion(this.vector, this.gameState);
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

    Sprite.prototype.draw = function(ctx, vector, camera, isCursor) {
      var self = this;
      ctx.drawImage(
        self.source, 
        self.currentFrame * self.w, 
        0, 
        self.w, 
        self.h, 
        vector.x - Math.round(self.w / 2) - (!isCursor ? camera.vector.x : 0), 
        vector.y - Math.round(self.h / 2) - (!isCursor ? camera.vector.y : 0), 
        self.w, 
        self.h
      );
    }

    return Sprite;

  }());


  window.e = {
    Game        : Game,
    Camera      : Camera,
    Screen      : Screen,
    GameObject  : GameObject,
    Sprite      : Sprite
  }

}());
