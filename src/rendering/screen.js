import Vector from '../algebra/vector'

/**
 * Screen class represents screen object. Stores width, height, center (Vector)
 */
class Screen {

  constructor( w, h ) {
    this.w       = w;
    this.h       = h;
    this.center = new Vector( Math.round(w/2), Math.round(h/2) );
  }

}

export default Screen;
