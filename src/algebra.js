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