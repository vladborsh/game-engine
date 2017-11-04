class Renderer {

  /**
   * Constructor
   * @param  {Context} ctx - reference to context object
   * @param  {Camera}  camera - reference to camera object (from main game object)
   */
  constructor( ctx, camera, screen ) {
    this.ctx = ctx;
    this.camera = camera;
    this.screen = screen;
  }
  
  /**
   * Draw current frame in according to current object position, current camera position
   * ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
   * @param  {Vector}  position - referense to object postion 
   */
  draw( position, sprite ) {
    this.ctx.save();
    if ( !isRequiredToRender( objectPosition, sprite.w, sprite.h, this.camera.position, this.screen ) ) {
      return;
    }
    if (!sprite.source) { 
      return;
    }
    let delta = calculateDelta( position, sprite )
    ctx.translate( delta.x, delta.y );
    this.ctx.drawImage(
      sprite.source, 
      sprite.currentFrame * sprite.w, 
      0, 
      sprite.w, 
      sprite.h, 
      0,
      0,
      sprite.w, 
      sprite.h
    ); 
    this.ctx.restore(); 
  }

  calculateDelta( objectPosition, sprite ) {
    return {
      x : objectPosition.x - Math.round(sprite.w / 2) - Math.round(this.camera.position.x - this.screen.size.w / 2),
      y : objectPosition.y - Math.round(sprite.h/ 2) - Math.round(this.camera.position.y - this.screen.size.h / 2)
    }
  }

}

export default Renderer;

function isRequiredToRender( objectPosition, width, height, camera, screen ) {
  var leftBound = camera.x - Math.round( screen.w/2 );
  var rightBound = camera.x + Math.round( screen.w/2);
  var topBound = camera.y + Math.round( screen.h/2);
  var bottomBound = camera.y - Math.round( screen.h/2);
  if ( (objectPosition.x + Math.round(width / 2)) < leftBound ) return false
  if ( (objectPosition.x - Math.round(width / 2)) > rightBound ) return false
  if ( (objectPosition.y - Math.round(height / 2)) > topBound ) return false
  if ( (objectPosition.y + Math.round(height / 2)) < bottomBound ) return false
  return true;
}