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