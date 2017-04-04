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

    Game.prototype.watchMouse = function () {
      this.canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        writeMessage(canvas, message);
      }, false);
    }

    Game.prototype.loop = function () {
      var self = this;
      setInterval(function() {
        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
        for(var i = 0; i < self.worldList.length; i++) self.worldList[i].change();
        for(var i = 0; i < self.worldList.length; i++) self.worldList[i].draw(self.context);
      }, 17);
    }

    Game.prototype.addObject = function (obj) {
      this.worldList.push(obj);
    }

    Game.prototype.addCursorGameObject = function () {
      var self = this;
      this.worldList.push(new GameObject(
        0, 0, 
        function() {
          return self.cursor.getPosition();
        },
        function(ctx) {
          ctx.fillStyle = "red";
          ctx.fillRect(this.x, this.y, 20, 20);
        }));
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
      this.x = x;
      this.y = y;
      if (canvas) {
        this.setListener(canvas);
      }
    }

    Cursor.prototype.setListener = function( canvas ) {
      var self = this;
      canvas.addEventListener('mousemove', function(evt) {
        var rect = canvas.getBoundingClientRect();
        self.x = evt.clientX - rect.left;
        self.y = evt.clientY - rect.top;
        console.log(self.x, self.y );
      }, false);
    }

    Cursor.prototype.getPosition = function() {
      var self = this;
      return { x:self.x, y:self.y }
    }

    return Cursor;

  }());

  /**
   * Camera class represents current camera position and conversion function. Conversion function should
   * consumes x and y parameters and should produces map with the conversioned parameters, before that conversion function
   * can consumes xCur and yCur params which represents current cursor position
   */
  var Camera = (function(){

    function Camera( x, y, conversion ) {
      this.x = x;
      this.y = y;
      this.conversion = conversion || defaultConversion;
    }

    function defaultConversion(x, y) {
      return {x: x, y: y};
    }

    return Camera;

  }());

  /**
   * GameObject class represents basic game object
   */
  var GameObject = (function() {

    function GameObject(x, y, conversationFunction, drawFunction) {
      var self = this;
      this.x = x || 0;
      this.y = y || 0;
      this.conversationFunction = conversationFunction || function(){return {x:self.x, y:self.y}};
      this.drawFunction = drawFunction || function(context){};
    }

    GameObject.prototype.setConversationFuncion = function( func ) {
      this.conversationFunction = func
    }

    GameObject.prototype.setDrawFuncion = function( func ) {
      this.drawFunction = func
    }

    GameObject.prototype.setSprite = function( sprite ) {
      this.sprite = sprite;
    }

    GameObject.prototype.change = function() {
      if (this.sprite) this.sprite.next();
      var newPos = this.conversationFunction();
      this.x = newPos.x;
      this.y = newPos.y;
    }

    GameObject.prototype.draw = function(context) {
      this.drawFunction(context);
    }

    return GameObject;

  }());

  window.e = {
    Game : Game,
    Camera : Camera
  }

}());
