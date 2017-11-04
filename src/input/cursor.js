import Vector from '../algebra/vector'

class Cursor {

  constructor ( x, y, canvas ) {
    this.position = new Vector(x, y);
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
      this.position.x = evt.clientX - rect.left;
      this.position.y = evt.clientY - rect.top;
    }, false);
  }

  getPosition() {
    return this.vector;
  }

}

export default Cursor;