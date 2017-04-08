;(function () {


  var Matrix = (function () {

    function Matrix( el ) {
      this.el = el || [
        [0, 0, 0], 
        [0, 0, 0], 
        [0, 0, 0]
      ];
    }

    Matrix.prototype.setTranslate = function(dx, dy) {
      this.el = [
        [0, 0, 0], 
        [0, 0, 0], 
        [dx, dy, 1]
      ];
      return el;
    }

    Matrix.prototype.setRotation = function(a) {
      a = a * Math.PI / 180;
      this.el = [
        [Math.cos(a), Math.sin(a), 0], 
        [-Math.sin(a), Math.cos(a), 0], 
        [0, 0, 1]
      ];
      return el;
    }

    Matrix.prototype.mult = function( el ) {
      if (typeof el === 'Matrix') {
        var ar = []
        for (var i = 0; i < this.el.length; i++) {
          var ar2 = []
          for (var j = 0; j < el[0].length; j++) {
            var item = 0;
            for (var m = 0; m < this.el[0].length; m++) {
              item += this.el[i][m] * el[m][j];
            }
            ar2.push(item);
          }
          ar.push(ar2);
        }
        return new Matrix(ar);
      } else if (typeof el === 'Vector') {
        var ar = []
        for (var i = 0; i < this.el.length; i++) {
          var item = 0;
          for (var m = 0; m < this.el[0].length; m++) {
            item += this.el[i][m] * el[m];
          }
          ar.push(item);
        }
        return new Matrix(ar);
      }
    } 

    return Matrix;

  }());


  var Vector = (function () {
    function Vector(x, y) {
      this.x = x;
      this.y = y;
    }

    Vector.prototype.exportArray = function () {
      return [ this.x, this.y ];
    }

    Vector.prototype.exportArrayAffine = function () {
      return [ this.x, this.y, 1 ];
    }

    Vector.prototype.importArray = function (arr) {
      this.x = arr[0];
      this.y = arr[1];
    }

    Vector.prototype.translate = function(dx, dy) {
      this.x += dx;
      this.y += dy;
    }

    Vector.prototype.translateVec = function(vector) {
      this.x += vector.x;
      this.y += vector.y;
    }

    Vector.prototype.rotateVec = function(a, vector) {
      a = a * Math.PI / 180;
      this.x = x * Math.cos(a) - y * Math.sin(a) - vector.x * (Math.cos(a) - 1) + vector.y * Math.sin(a);
      this.y = y * Math.sin(a) + y * Math.cos(a) - vector.y * (Math.cos(a) - 1) + vector.x * Math.sin(a);
    }

    return Vector;

  }());


  window.a = {
    Matrix : Matrix,
    Vector : Vector
  }

}());
;(function() {

  /**
   * Represents object that stores solid bodies list.
   * Implements SAP collision detection algorithm
   */
  var Collider = (function() {

    /**
     * Constructor
     */
    function Collider() {
      this.objects = [];
    }

    /**
     * Add new solid body to array
     * @param {SolidBody} body object
     */
    Collider.prototype.add = function( body ) {
      this.objects.push(body);
    }

    /**
     * Collision detection
     */
    Collider.prototype.run = function() {
      this.sort();
      this.validate()
    }

    /**
     * Sort solid body objects (Merge sort)
     */
    Collider.prototype.sort = function() {
      this.objects = internalSort(this.objects);
    }

    /**
     * Validate every object to collision
     */
    Collider.prototype.validate = function() {
      for(var i = 0; i < this.objects.length; i++) {
        var overlaping = true;
        var nextToValidate = i;
        while (overlaping) {
          if (nextToValidate+1 >= this.objects.length ) break;
          overlaping = this.objects[i].validate(this.objects[nextToValidate+1]);
          if (overlaping) {
            this.objects[i].collided = true;
            this.objects[nextToValidate+1].collided = true;
          }
          nextToValidate += 1;
        }
      }
    }

    /**
     * Merge sort
     * @param  {Array<SolidBody>} solid body array
     * @return {Array<SolidBody>}
     */
    function internalSort( objects ) {
      if (objects.length < 2) {
        return objects;
      }
      var middle = Math.floor(objects.length / 2);
      var leftRange = objects.slice(0, middle);
      var rightRange = objects.slice(middle, objects.length);
      var mergingResult = merge( internalSort( leftRange ), internalSort( rightRange ) );
      return mergingResult;
    }

    /**
     * Merge left and right parts of array
     * @param  {Array<SolidBody>} left part of array 
     * @param  {Array<SolidBody>} right part of array
     * @return {Array<SolidBody>}
     */
    function merge( left, right ) {
      var res = [];
      while (left.length > 0 && right.length > 0) {                
        if (left[0].compare(right[0]) == -1) {
          res.push(left.shift());
        } else {
          res.push(right.shift());
        }                                              
      }            
      while (left.length > 0) {                
        res.push(left.shift());
      }            
      while (right.length > 0) {            
        res.push(right.shift());
      }
      return res;
    }

    return Collider;

  }())

  /**
   * Represents solid body boundaies as 2 vectors
   */
  var SolidBody = (function() {

    /**
     * Constructor
     * @param {Vector} min vector (top left corner)
     * @param {Vector} max vector (right bottom corner)
     * @param {String} some is [optional]
     */
    function SolidBody( min, max, id ) {
      this.min = min || {x: 0, y: 0};
      this.max = max || {x: 0, y: 0};
      this.id = id;
    }

    /**
     * Compares with other body
     * @param  {SolidBody} solid body
     * @return {Integer} 
     */
    SolidBody.prototype.compare = function( body ) {
      if (this.min.x < body.min.x || (this.min.x == body.min.x && this.min.y < body.min.y)) {
        return -1;
      } else if (this.min.x == body.min.x && this.min.y == body.min.y) {
        return 0;
      } else if (this.min.x > body.min.x || this.min.y > body.min.y) {
        return 1;
      }
    }

    /**
     * Check collision (overlapping)
     * @param  {SolidBody} next body in array
     * @return {Boolean}
     */
    SolidBody.prototype.validate = function( body ) {
      return (this.max.x >= body.min.x && this.max.y >= body.min.y && this.min.y <= body.max.y)
    }

    return SolidBody;

  }());

  window.c = {
    Collider  : Collider,
    SolidBody : SolidBody
  };

}());
;(function() {

  var INTERVAL = 18;

  /**
   * Represents main game object. This object runs main game loop. This object
   * stores reference to canvas, reference to context, list of object in the world, 
   * reference to Cursor object, reference to GameState object.
   */
  var Game = (function(){
    
    /**
     * Contructor
     * @param {Integer} width of canvas
     * @param {Integer} height of canvas
     */
    function Game( w, h ) {
      this.canvas        = document.createElement("canvas"),
      this.canvas.width  = w || window.innerWidth;
      this.canvas.height = h || window.innerHeight;
      this.context       = this.canvas.getContext("2d");
      this.world         = [];
      this.screen        = new Screen( this.canvas.width, this.canvas.height );
      this.cursor        = new Cursor( this.screen.center.x, this.screen.center.y, this.canvas  );
      this.state         = new GameState();
      this.cursor.setListener();
      document.body.insertBefore( this.canvas, document.body.childNodes[0] );
      setupIcon();
    }

    /**
     * Main game loop. At first change camera position, recalculate angle between screen center and cursor, clear game area.
     * In first stage iterate over all game world objects and invoke 'change' function.
     * In second stage iteratesover all game world objects and invoke 'draw' function.
     * Pass to draw function context object, camera object, boolean identificator of current object is cursor, cursor object
     */
    Game.prototype.loop = function () {
      var self = this;
      var loopId = setInterval(function() {
        self.camera.change();
        self.calculateCursorAngle();
        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
        for(var i = 0; i < self.world.length; i++) {
          self.world[i].change();
        }
        for(var i = 0; i < self.world.length; i++) {
          self.world[i].draw(
            self.context, 
            self.camera, 
            i == self.world.length-1, 
            self.cursor
          );
        }
      }, INTERVAL);
    }

    /**
     * Add new game object in the beggining of game world array. Object that has beeing added later will be drawn below
     * @param {GameObject} new game object
     */
    Game.prototype.addObject = function( obj ) {
      this.world.unshift(obj);
    }

    /**
     * Calculation angle of cursor screen. 
     * Need for determination delta vector if client set screen translation by cursor moving
     */
    Game.prototype.calculateCursorAngle = function () {
      var dy = this.screen.center.y - this.cursor.vector.y,
          dx = this.screen.center.x - this.cursor.vector.x;
      var k = dy / dx;
      this.cursor.angle = Math.atan2( dy, dx );
    }

    /**
     * Set camera object and pass screen object to them
     * @param {Camera} camera object
     */
    Game.prototype.setCamera = function( camera ) {
      this.camera = camera;
      this.camera.screen = this.screen;
    }

    /**
     * Set cursor object. It is desirable invoke this function before adding all other game objects
     * @param {Sprite} cursor sprite object
     */
    Game.prototype.addCursorGameObject = function( sprite ) {
      var self = this;
      var _cursor = new GameObject(
        0, 0, 
        function(vector) {
          vector.x = self.cursor.getPosition().x;
          vector.y = self.cursor.getPosition().y;
        })
      _cursor.sprite = sprite;
      this.world.unshift(_cursor);
    }

    /* Private functions */

    function setupIcon(argument) {
      var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = 'https://puu.sh/vdJf9/0aaeac54da.png';
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    return Game;

  }());

  /**
   * Game state class stores current game state, which will be changed by button clicking
   */
  var GameState = (function() {
    
    /**
     * Contructor set listeners
     */
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
      document.addEventListener('contextmenu', 
        function( e ) {
          e.preventDefault()
        }, false
      );
    }

    return GameState;

  }())


  /**
   * Screen class represents screen object. Stores width, height, center (Vector)
   */
  var Screen = (function() {

    /**
     * Constructor
     * @param {Integer} width
     * @param {Integer} height
     */
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
    
    /**
     * Constructor
     * @param {Integer} x position
     * @param {Integer} y position
     * @param {Canvas} reference to canvas
     */
    function Cursor(x, y, canvas) {
      this.vector = new a.Vector(x, y);
      this.canvas = canvas;
      if (canvas) {
        this.setListener(canvas);
      }
      this.rotationByCursor = false;
      this.angle = 0;
    }

    /**
     * Change cursor object vector by mouse moving on the canvas
     */
    Cursor.prototype.setListener = function() {
      var self = this;
      self.canvas.addEventListener('mousemove', function(evt) {
        var rect = self.canvas.getBoundingClientRect();
        self.vector.x = evt.clientX - rect.left;
        self.vector.y = evt.clientY - rect.top;
      }, false);
    }

    /**
     * Return current cursor object position
     */
    Cursor.prototype.getPosition = function() {
      return this.vector;
    }

    return Cursor;

  }());


  /**
   * GameObject class represents basic game object
   */
  var GameObject = (function() {

    /**
     * Constructor
     * @param {Integer} x position
     * @param {Integer} y position
     * @param {Function} conversion function, should accept vector, game state, controller
     * @param {GameState} reference to current game state (that stores in main object)
     * @param {Sprite} sprite object
     * @param {Controller} controller object
     */
    function GameObject( x, y, conversion, gameState, sprite, controller ) {
      this.vector     = new a.Vector(x, y);
      this.conversion = conversion || (function(vector) { vector.translate(0, 0); });
      this.gameState  = gameState;
      this.sprite     = sprite;
      this.controller = controller;
      if (this.controller) this.controller.ownVec = this.vector;
    }

    /**
     * Invoke conversion function and call next frame in sprite object
     */
    GameObject.prototype.change = function() {
      if (this.sprite) this.sprite.next();
      this.conversion(this.vector, this.gameState, this.controller);
    }

    /**
     * If sprite is setted call draw function from them
     * @param  {Context} reference to context object
     * @param  {Camera} reference to camera object
     * @param  {Boolean} identification that it is cursor object
     * @param  {Cursor} reference to cursor objject
     */
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

    /**
     * Constructor
     * @param {Integer} x position
     * @param {Integer} y position
     * @param {Function} conversion function, should accept vector, game state, controller
     * @param {GameState} referrence to current game state (that stores in main object)
     * @param {Controller} controller object
     */
    function Camera( x, y, conversion, gameState, controller ) {
      this.vector     = new a.Vector(x, y);
      this.conversion = conversion || (function(vector) { vector.translate(0, 0); });
      this.gameState  = gameState;
      this.controller = controller;
      if (this.controller) 
        this.controller.ownVec = this.vector;
    }

    /**
     * Invoke conversion function
     */
    Camera.prototype.change = function() {
      this.conversion(this.vector, this.gameState, this.controller);
    }

    return Camera;

  }());

  /**
   * Represents sprite object. Stores texture and current frame, could draw current frame on canvas
   */
  var Sprite = (function() {

    /**
     * Constructor
     * @param {String} texture file destination
     * @param {Integer} width
     * @param {Integer} height
     * @param {Integer} duration in millisecons
     * @param {Integer} first frame index  
     * @param {Integer} amounf of frame in sprite
     * @param {Boolean} identificates that animation will reversed if current frame reach the limits
     * @param {Boolean} image is unchanged by camera position
     * @param {Integer} altitude identify camera object translation according to camera (Outlook)
     */
    function Sprite(source, w, h, duration, firstFrame, animationLength, bounce, static, altitude) {
      this.source               = new Image();
      this.source.src           = source;
      this.w                    = w;
      this.h                    = h;
      this.duration             = duration;
      this.animationLength      = animationLength;
      this.frameDuration        = Math.round(this.duration / INTERVAL / animationLength);
      this.currentFrameLifeTime = 0;
      this.firstFrame           = firstFrame;
      this.currentFrame         = this.firstFrame;
      this.reverse              = false;
      this.bounce               = bounce || false;
      this.static               = static;
      this.altitude             = altitude;
    }

    /**
     * Change current frame if current frame lifetime expires, increment lifetime in another case
     * Process bouncing and reverse frame direction
     */
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

    /**
     * Draw current frame in according to current object position, current camera position
     * @param  {Context} reference to context object
     * @param  {Vector}  vector object (stores in parent game object)
     * @param  {Camera}  camera object (from main game object)
     * @param  {Boolean} is cursor identificator 
     * @param  {Cursor} reference to cursor object
     */
    Sprite.prototype.draw = function(ctx, vector, camera, isCursor, cursor) {
      var self = this;
      var dx = 0, dy = 0;
      if (cursor.rotationByCursor && !isCursor) {
        dx = Math.cos(cursor.angle) * 20;
        dy = Math.sin(cursor.angle) * 20;
      }
      ctx.drawImage(
        self.source, 
        self.currentFrame * self.w, 
        0, 
        self.w, 
        self.h, 
        vector.x 
          - Math.round(self.w / 2) 
          - ((!this.static) 
            ? (
              ((!isCursor 
                ? Math.round(camera.vector.x - camera.screen.w / 2) 
                : 0
              ) + dx) 
              * ((self.altitude) 
                ? self.altitude 
                : 1
                )
              ) 
            : 0
          ), 
        vector.y 
          - Math.round(self.h / 2) 
          - ((!this.static) 
            ? (
              ((!isCursor 
                ? Math.round(camera.vector.y - camera.screen.h / 2) 
                : 0
              ) + dy) 
              * ((self.altitude) 
                ? self.altitude 
                : 1
                )
              ) 
            : 0
          ), 
        self.w, 
        self.h
      ); 
      
    }

    return Sprite;

  }());

  /**
   * Represents game object controller. Stores some physics like acceleration, slip, etc
   */
  var Controller = (function () {

    /**
     * Constructor
     * @param {Vector} velocity
     * @param {Vector} acceleration
     * @param {GameState} current game state
     * @param {Integer} acceleration boost if game state is triggered
     * @param {Integer} max velocity
     * @param {Integer} slip coefficient
     * @param {Vector} vector of linked object [optional]
     */
    function Controller(v, a, state, accelerationBoost, maxVelocity, slipCoefficient, linkedVec) {
      this.velocity          = v;
      this.acceleration      = a;
      this.gameState         = state;
      this.accelerationBoost = accelerationBoost;
      this.maxVelocity       = maxVelocity;
      this.minVelocity       = -maxVelocity;
      this.slipCoefficient   = slipCoefficient;
      this.prevVelocity      = v;
      this.linkedVec         = linkedVec;
      this.ownVec            = {x:0, y:0};
    }

    /**
     * Change current velocity in according to current acceleration
     * @return {Vector}
     */
    Controller.prototype.accelerate = function () {
      this.setAcceleration();
      this.velocity.x += 
        ((this.velocity.x < this.maxVelocity) && (this.velocity.x > this.minVelocity)) 
          ? this.acceleration.x : 0;
      this.velocity.y += 
        ((this.velocity.y < this.maxVelocity) && (this.velocity.y > this.minVelocity)) 
          ? this.acceleration.y : 0;
      /* Set velocity to max if maximum was exceeded */
      this.velocity.x = (this.velocity.x > this.maxVelocity) ? this.maxVelocity : this.velocity.x;
      this.velocity.y = (this.velocity.y > this.maxVelocity) ? this.maxVelocity : this.velocity.y;
      /* Set velocity to min if minimum was exceeded */
      this.velocity.x = (this.velocity.x < this.minVelocity) ? this.minVelocity : this.velocity.x;
      this.velocity.y = (this.velocity.y < this.minVelocity) ? this.minVelocity : this.velocity.y;
      
      this.absoluteStopMinVelocity()
      this.prevVelocity.x = this.velocity.x;
      this.prevVelocity.y = this.velocity.y;
      return this.velocity;
    }

    /**
     * Set acceleration value in according to current game state, or in according to current linked vector
     * if such is presents
     */
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

    /**
     * Set velocity value to zero if allowable arror is reached
     */
    Controller.prototype.absoluteStopMinVelocity = function () {
      if (this.velocity.x == this.prevVelocity.x 
        && this.velocity.x != 0 
        && this.velocity.x < 1 
        && this.velocity.x > -1) 
      {
        this.velocity.x = 0;
      }
      if (this.velocity.y == this.prevVelocity.y 
        && this.velocity.y != 0 
        && this.velocity.y < 1 
        && this.velocity.y > -1) 
      {
        this.velocity.y = 0;
      }
    }

    /**
     * Slip imitation after zeroing of acceleration
     */
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

  }());

  /**
   * Representation of media storage in main game object.
   * It is storing images and return images from storage by key , storage can be oranized by folders.
   * Image (or folder) can be removed on demand
   */
  var MediaStorage = (function () {
    
    /**
     * Constructor
     * @param {Game} reference to Game object
     */
    function MediaStorage( game ) {
      this.game = game;
      this.storage = {};
    }

    /**
     * Adding new record for media object to storage or in folder if folder is fpecified
     * Record contains Image object and array of indexes. By that indexes can be finded game objects in world list
     * (it is needed for memory releasing)
     * @param {String} key in storage or in folder
     * @param {String} source location
     * @param {String} folder name
     * @return {String}
     */
    MediaStorage.prototype.add = function( key, src, folder ) {
      var img = new Image();
      img.src = src;
      var record = {
        item       : img,
        references : []
      };
      if (folder) {
        if (!this.storage[folder]) this.storage[folder] = {};
        this.storage[folder][key] = record;
        return this.storage[folder][key];
      } else {
        this.storage[key] = record;
        return this.storage[key];
      }
    }

    /**
     * Removing media objects from storage or from folder by key. If storage contains folder with specified key, 
     * all records from folder will be deleted. Removing occurs by pass through array of indexes and invoking
     * 'removeSprite' method in game object with this index
     * @param  {String} key in storage
     * @param  {String} folder name in storage
     * @return {String}
     */
    MediaStorage.prototype.remove = function( key, folder ) {
      if (folder) {
        for (var i = 0; i < this.storage[folder][key].references.length; i++) {
          this.game.world[this.storage[folder][key].references[i]].removeSprite(key);
        }
        this.storage[folder][key] = undefined;
      } else {
        if (this.storage[key] instanceof Object) {
          for (var j in this.storage[key]) {
            this.remove( j, key );
          }
        } else {
          for (var i = 0; i < this.storage[key].references.length; i++) {
            this.game.world[this.storage[key].references[i]].removeSprite(key);
          }
        }
        this.storage[key] = undefined;
      }
      return key;
    }

    /**
     * Cleaning of all storage by pass through map and remove by key. If object is folder, before removing 
     * of folder all inner records will be removed
     */
    MediaStorage.prototype.clean = function() {
      for (var key in this.storage) {
        this.remove(key);
      }
    }

    /**
     * Geting image object from storage or from floder by key
     * @param  {String} key in storage
     * @param  {Integer} index of game object in world list
     * @param  {String} folder name in storage
     * @return {Image}
     */
    MediaStorage.prototype.get = function( key, gameObjectIndex, folder ) {
      if (folder) {
        this.storage[folder][key].references.push(gameObjectIndex);
        return this.storage[folder][key].item;
      } else {
        if (!(this.storage[key] instanceof Object)) {
          this.storage[key].references.push(gameObjectIndex);
          return this.storage[key].item;
        }
      }
    }
    
    return MediaStorage;

  }());


  window.e = {
    Game         : Game,
    Camera       : Camera,
    Screen       : Screen,
    GameObject   : GameObject,
    Sprite       : Sprite,
    Controller   : Controller,
    MediaStorage : MediaStorage
  }

}());
