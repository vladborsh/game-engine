;(function() {


  var Game = (function(){
    
    function Game(w, h) {
      this.canvas = document.createElement("canvas"),
      this.canvas.width = w || window.innerWidth;
      this.canvas.height = h || window.innerHeight;
      this.context = this.canvas.getContext("2d");
      this.worldList = [];
      this.screen = new Screen();
      this.cursor = new Cursor();
      this.cursor.setListener(this.canvas)
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }

    Game.prototype.loop = function () {
      var self = this;
      var loopId = setInterval(function() {
        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
        for(var i = 0; i < self.worldList.length; i++) self.worldList[i].change();
        for(var i = 0; i < self.worldList.length; i++) self.worldList[i].draw(self.context);
      }, 17);
      //clearInterval(loopId);
    }

    Game.prototype.addObject = function (obj) {
      this.worldList.push(obj);
    }

    Game.prototype.addCursorGameObject = function (sprite) {
      var self = this;
      var _cursor = new GameObject(
        0, 0, 
        function(vector) {
          vector.x = self.cursor.getPosition().x;
          vector.y = self.cursor.getPosition().y;
        })
      _cursor.setSprite(sprite);
      this.worldList.push(_cursor);
    }

    return Game;

  }());


  /**
   * Screen class represents screen object
   */
  var Screen = (function() {

    function Screen( w, h ) {
      this.w = w;
      this.h = h;
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

    function GameObject(x, y, conversion) {
      this.vector = new a.Vector(x, y);
      this.conversion = conversion || (function(vector) { vector.translate(0, 0); });
    }

    GameObject.prototype.setConversionFuncion = function( func ) {
      this.conversion = func
    }

    GameObject.prototype.setSprite = function( sprite ) {
      this.sprite = sprite;
    }

    GameObject.prototype.change = function() {
      if (this.sprite) this.sprite.next();
      var newPos = this.conversion(this.vector);
    }

    GameObject.prototype.draw = function(context, camera) {
      if (this.sprite) {
        this.sprite.draw(context, this.vector, camera)
      }
    }

    return GameObject;

  }());


  /**
   * Camera class represents current camera position and conversion function. 
   */
  var Camera = (function(){

    function Camera( x, y, conversion ) {
      this.vector = new a.Vector(x, y);
      this.conversion = conversion || (function(vector) { return vector.translate(0, 0); });
    }

    return Camera;

  }());


  var Sprite = (function() {

    function Sprite(source, w, h, duration, interval, firstFrame) {
      this.source = new Image();
      this.source.src = source;
      this.source.onload = function () {
        console.log('loaded');
        this.loadStatus = true;
      }
      this.w = w;
      this.h = h;
      this.duration = duration;
      this.interval = interval;
      this.animationLength = Math.round(this.duration / this.interval);
      this.firstFrame = firstFrame;
      this.currentFrame = this.firstFrame;
      this.reverse = false;
      this.bounce = false;
      this.loadStatus = false;
    }

    Sprite.prototype.next = function() {
      if (this.currentFrame == this.animationLength ) { 
        if (this.bounce) {
          this.reverse = true;
        } else {
          this.currentFrame = 0;
        }
      } else if (this.currentFrame == 0 && this.reverse) {
        this.reverse = false;
      }
      this.currentFrame += this.reverse ? -1 : 1;
    }

    Sprite.prototype.draw = function(ctx, vector, camera) {
      var self = this;
      ctx.drawImage(
        self.source, 
        0, 
        self.currentFrame * self.w, 
        self.w, 
        self.h, 
        vector.x - Math.round(self.w / 2), 
        vector.y - Math.round(self.h / 2), 
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
