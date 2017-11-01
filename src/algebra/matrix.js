class Matrix {

  constructor(el) {
    this.el = el || [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
  }

  setTranslate(dx, dy) {
    this.el = [
      [0, 0, 0],
      [0, 0, 0],
      [dx, dy, 1]
    ];
    return el;
  }

  setRotation(a) {
    a = a * Math.PI / 180;
    this.el = [
      [Math.cos(a), Math.sin(a), 0],
      [-Math.sin(a), Math.cos(a), 0],
      [0, 0, 1]
    ];
    return el;
  }

  mult(el) {
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
  
}

export default Matrix;