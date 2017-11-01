class Vector {
  constructor ( x, y ) {
    this.x = x;
    this.y = y;
  }

  exportArray( ) {
    return [ this.x, this.y ];
  }

  exportArrayAffine( ) {
    return [ this.x, this.y, 1 ];
  }

  importArray( arr ) {
    this.x = arr[0];
    this.y = arr[1];
  }

  translate( dx, dy ) {
    this.x += dx;
    this.y += dy;
  }

  translateVec( vector ) {
    this.x += vector.x;
    this.y += vector.y;
  }

  rotateVec( a, vector ) {
    a = a * Math.PI / 180;
    this.x = x * Math.cos(a) - y * Math.sin(a) - vector.x * (Math.cos(a) - 1) + vector.y * Math.sin(a);
    this.y = y * Math.sin(a) + y * Math.cos(a) - vector.y * (Math.cos(a) - 1) + vector.x * Math.sin(a);
  }

}

export default Vector