import Vector from '../algebra/vector'

/**
 * Camera class represents current camera position and conversion function. 
 */
class Camera {

  /**
   * Constructor
   * @param {Integer}    x - position
   * @param {Integer}    y - position
   * @param {Function}   conversion - function which should accept vector, game state, controller
   * @param {GameState}  gameState - referrence to current game state (that stores in main object)
   * @param {Controller} controller -reference to controller object
   */
  constructor( x, y, conversion, gameState, controller ) {
    this.position     = new Vector(x, y);
    this.conversion = conversion || (function(vector) { vector.translate(0, 0); });
    this.gameState  = gameState;
    this.controller = controller;
    if (this.controller) {
      this.controller.ownVec = this.vector;
    }
  }

  change() {
    this.conversion( this.vector, this.gameState, this.controller );
  }

}

export default Camera;
