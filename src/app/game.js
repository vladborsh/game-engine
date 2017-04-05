window.onload = function() {
  var g = new e.Game();
  g.addCursorGameObject(
    new e.Sprite(
      './assets/aim.png',
      50, 50, 100, 20, 0
    )
  );
  g.loop();

  /*var img = new Image();
  img.src = './assets/aim.png'
  console.log(img);
  img.onload = function() {
    g.context.drawImage(img, 150, 150);
  }*/
  
}