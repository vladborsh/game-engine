class Renderer {

  /**
   * Constructor
   * @param  {Context} ctx - reference to context object
   * @param  {Camera}  camera - reference to camera object (from main game object)
   * @param  {Cursor}  cursor - reference to cursor object
   */
  constructor( ctx, camera, cursor ) {
    this.ctx = ctx;
    this.cursor = cursor;
    this.camera = camera;
  }
  
  /**
   * Draw current frame in according to current object position, current camera position
   * ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
   * @param  {Vector}  vector - referense to vector object (stores in parent game object)
   * @param  {Boolean} isCursor - is cursor identificator 
   */
  draw( vector, sprite, isCursor) {
    this.ctx.save( vector, sprite.w, sprite.h, );
    isRequiredToRender()
    if (!sprite.source) return;
    var dx = 0, dy = 0;
    if (cursor.rotationByCursor && !isCursor) {
      dx = Math.cos(cursor.angle) * 20;
      dy = Math.sin(cursor.angle) * 20;
    }
    this.ctx.drawImage(
      sprite.source, 
      sprite.currentFrame * sprite.w, 
      0, 
      sprite.w, 
      sprite.h, 
      vector.x 
        - Math.round(self.w / 2) 
        - ((!this.static) 
          ? (
            ((!isCursor 
              ? Math.round(camera.vector.x - camera.screen.w / 2) 
              : 0
            ) + dx) 
            ) 
          : 0
        ), 
      vector.y 
        - Math.round(self.h / 2) 
        - ((!this.static) 
          ? (
            ((!isCursor 
              ? Math.round(camera.vector.y - camera.screen.h / 2) 
              : 0
            ) + dy) 
            ) 
          : 0
        ), 
      self.w, 
      self.h
    ); 
    this.ctx.restore(); 
  }

  defineDelta() {

  }

}

export default Renderer;

function isRequiredToRender( rendererobjectPosition, width, height, camera, screen ) {
  var leftBound = camera.x - Math.round( screen.w/2 );
  var rightBound = camera.x + Math.round( screen.w/2);
  var topBound = camera.y + Math.round( screen.h/2);
  var bottomBound = camera.y - Math.round( screen.h/2);
  if ( (rendererobjectPosition.x + Math.round(width / 2)) < leftBound ) return false
  if ( (rendererobjectPosition.x - Math.round(width / 2)) > rightBound ) return false
  if ( (rendererobjectPosition.y - Math.round(height / 2)) > topBound ) return false
  if ( (rendererobjectPosition.y + Math.round(height / 2)) < bottomBound ) return false
  return true;
}