/**
 * Represents sprite object. Stores texture and current frame, could draw current frame on canvas
 */
class Sprite {

  /**
   * Constructor
   * @param {String}  source - texture file destination
   * @param {Integer} w- width
   * @param {Integer} h -height
   * @param {Integer} duration - duration in millisecons
   * @param {Integer} firstFrame - first frame index  
   * @param {Integer} animationLength - frames amount in sprite
   * @param {Boolean} bounce - identificates that animation will reversed if current frame reach the limits
   * @param {Boolean} static - image is unchanged by camera position
   * @param {Integer} altitude - identify camera object translation according to camera (Outlook)
   */
  constructor( source, w, h, duration, firstFrame, animationLength, bounce, static, altitude ) {
    this.source               = source;
    this.w                    = w;
    this.h                    = h;
    this.duration             = duration;
    this.animationLength      = animationLength;
    this.frameDuration        = Math.round(this.duration / INTERVAL / animationLength);
    this.currentFrameLifeTime = 0;
    this.firstFrame           = firstFrame;
    this.currentFrame         = this.firstFrame;
    this.reverse              = false;
    this.bounce               = bounce || false;
    this.static               = static;
    this.altitude             = altitude;

  }
  
  /**
   * Change current frame if current frame lifetime expires, increment lifetime in another case
   * Process bouncing and reverse frame direction
   */
  next() {
    if ( this.currentFrameLifeTime == this.frameDuration ) {
      this.currentFrameLifeTime = 0;
      this.currentFrame += this.reverse ? -1 : 1;
    } else {
      this.currentFrameLifeTime++;
    }
    if ( this.currentFrame == this.animationLength - 1 ) { 
      if (this.bounce) {
        this.reverse = true;
      } else {
        this.currentFrame = 0;
      }
    } else if (this.currentFrame == 0 && this.reverse) {
      this.reverse = false;
    }
  }

}

