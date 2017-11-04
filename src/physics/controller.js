/**
 * Represents game object controller. Stores some physics like acceleration, slip, etc
 */
class Controller {

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
  constructor( v, a, state, accelerationBoost, maxVelocity, slipCoefficient, linkedVec ) {
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
  accelerate() {
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
  setAcceleration() {
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
  absoluteStopMinVelocity() {
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
  slip() {
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

}

export default Controller;