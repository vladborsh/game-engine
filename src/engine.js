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
     * @param {Integer} w - width of canvas
     * @param {Integer} h -height of canvas
     */
    function Game( w, h ) {
      this.mediaStorage  = new MediaStorage(this);
      this.canvas        = document.createElement("canvas"),
      this.canvas.width  = w || window.innerWidth;
      this.canvas.height = h || window.innerHeight;
      this.context       = this.canvas.getContext("2d");
      this.world         = [[]];
      this.screen        = new Screen( this.canvas.width, this.canvas.height );
      this.cursor        = new Cursor( this.screen.center.x, this.screen.center.y, this.canvas  );
      this.state         = new GameState();
      this.gameStage     = 0;
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
        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
        self.camera.change();
        self.calculateCursorAngle();
        self.cursorGameObject.change();
        for(var i = 0; i < self.world[self.gameStage].length; i++) {
          self.world[self.gameStage][i].change();
        }
        for(var i = 0; i < self.world[self.gameStage].length; i++) {
          self.world[self.gameStage][i].draw(
            self.context, 
            self.camera, 
            false, 
            self.cursor
          );
        }
        self.cursorGameObject.draw(
          self.context,
          self.camera, 
          true, 
          self.cursor
        );
      }, INTERVAL);
    }

    /**
     * Add new game object in the beggining of game world array. Object that has beeing added later will be drawn below
     * @param {GameObject} obj - reference to new game object
     * @param {Integer}    gameStage - gameStageIndex
     */
    Game.prototype.addObject = function( obj, gameStage ) {
      if (gameStage) {
        if (!this.world[gameStage]) this.world[gameStage] = [];
        this.world[gameStage].unshift(obj);
      } else {
        if (!this.world[0]) this.world[0] = [];
        this.world[0].unshift(obj);
      }

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
     * @param {Camera} camera - reference to camera object
     */
    Game.prototype.setCamera = function( camera ) {
      this.camera = camera;
      this.camera.screen = this.screen;
    }

    /**
     * Set cursor object. It is desirable invoke this function before adding all other game objects
     * @param {Sprite} sprite - reference to cursor sprite
     */
    Game.prototype.addCursorGameObject = function( sprite ) {
      var self = this;
      var _cursor = new GameObject(
        0, 0, 
        function(vector) {
          vector.x = self.cursor.getPosition().x;
          vector.y = self.cursor.getPosition().y;
        },
        undefined,
        sprite
      );
      this.cursorGameObject = _cursor;
    }

    /* Private functions */

    function setupIcon( argument ) {
      var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = 'https://puu.sh/vdJf9/0aaeac54da.png';
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    return Game;

  }());

  


  




  /**
   * GameObject class represents basic game object
   */
  var GameObject = (function() {

    /**
     * Constructor
     * @param {Integer}    x - position
     * @param {Integer}    y - position
     * @param {Function}   conversion - function that should accept vector, game state, controller
     * @param {GameState}  gameState - reference to current game state (that stores in main object)
     * @param {Sprite}     sprite - reference for sprite object
     * @param {Controller} controller - controller object
     */
    function GameObject( x, y, conversion, gameState, sprite, controller ) {
      this.vector        = new a.Vector(x, y);
      this.conversion    = conversion || (function(vector) { vector.translate(0, 0); });
      this.gameState     = gameState;
      this.sprites       = [sprite]
      this.controller    = controller;
      if (this.controller) this.controller.ownVec = this.vector;
      this.innerState = {
        currentSprite : 0
      }
    }

    /**
     * Invoke conversion function
     */
    GameObject.prototype.change = function() {
      this.conversion(this.vector, this.gameState, this.controller, this.innerState);
    }

    /**
     * If sprite is setted call draw function from them, call next frame in sprite object
     * @param  {Context} context -  reference to context object
     * @param  {Camera}  camera - reference to camera object
     * @param  {Boolean} isCursor - identification that it is cursor object
     * @param  {Cursor}  cursor - reference to cursor objject
     */
    GameObject.prototype.draw = function( context, camera, isCursor, cursor ) {
      if (this.sprites[this.innerState.currentSprite]) {
        this.sprites[this.innerState.currentSprite].draw(context, this.vector, camera, isCursor, cursor);
        this.sprites[this.innerState.currentSprite].next();
      }
    }

    return GameObject;

  }());


  /**
   * Represents game object controller. Stores some physics like acceleration, slip, etc
   */
  var Controller = (function () {

    /**
     * Constructor
     * @param {Vector}    v - reference to velocity vector
     * @param {Vector}    a - reference to acceleration vector
     * @param {GameState} state - reference to current game state object
     * @param {Integer}   accelerationBoost - acceleration boost value (per one game cycle iteration)
     * @param {Integer}   maxVelocity - max velocity value
     * @param {Integer}   slipCoefficient - slip coefficient
     * @param {Vector}    linkedVec - reference to vector of linked object
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
     * @param {Game} game - reference to Game object
     */
    function MediaStorage( game ) {
      this.game = game;
      this.storage = {};
    }

    /**
     * Adding new record for media object to storage or in folder if folder is fpecified
     * Record contains Image object and array of references. By that references can be finded game objects from world list
     * (it is needed for memory releasing)
     * @param  {String} key - key in storage or in folder
     * @param  {String} src - source location
     * @param  {String} folder - folder name
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
     * 'removeSprite' method from game object
     * @param  {String} key - key in storage
     * @param  {String} folder - folder name in storage
     * @return {String}
     */
    MediaStorage.prototype.remove = function( key, folder ) {
      if (folder) {
        for (var i = 0; i < this.storage[folder][key].references.length; i++) {
          if (this.storage[folder][key].references[i]) {
            this.storage[folder][key].references[i].removeSprite(key);
          }
        }
        this.storage[folder][key] = undefined;
      } else {
        if (this.storage[key] instanceof Object) {
          for (var j in this.storage[key]) {
            this.remove( j, key );
          }
        } else {
          for (var i = 0; i < this.storage[key].references.length; i++) {
            if (this.storage[key].references[i]) {
              this.storage[key].references[i].removeSprite(key);
            }
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
     * @param  {String}     key - key in storage
     * @param  {GameObject} gameObjectReference - reference to game object in world list
     * @param  {String}     folder - folder name in storage
     * @return {Image}
     */
    MediaStorage.prototype.get = function( key, gameObjectReference, folder ) {
      if (folder) {
        this.storage[folder][key].references.push(gameObjectIndex);
        return this.storage[folder][key].item;
      } else {
        if (this.storage[key].references) {
          this.storage[key].references.push(gameObjectReference);
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
