import Vector from '../algebra/vector'

class Cursor {

  constructor ( x, y, canvas ) {
    this.vector = new Vector(x, y);
    this.canvas = canvas;
    if (canvas) {
      this.setListener(canvas);
    }
    this.rotationByCursor = false;
    this.angle = 0;
  }

  setListener() {
    this.canvas.addEventListener('mousemove', (evt) => {
      var rect = this.canvas.getBoundingClientRect();
      this.vector.x = evt.clientX - rect.left;
      this.vector.y = evt.clientY - rect.top;
    }, false);
  }

  getPosition() {
    return this.vector;
  }

}

export default Cursor;