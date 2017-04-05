window.onload = function() {
  var g = new e.Game();
  g.addCursorGameObject(
    new e.Sprite(
      './assets/aim2.png',
      100, 100, 300, 17, 0, 4, true
    )
  );
  g.loop();

  g.setCamera(
    new e.Camera(
      500, 500,
      function(vector, state) {
        vector.translate((state.left) ? -10 : 0 + (state.right) ? 10 : 0, (state.top) ? -10 : 0 + (state.bottom) ? 10 : 0);
        console.log(vector.x, vector.y );
      },
      g.state
    )
  );

  /* Set background */
  for (var x = 0; x < 20; x ++) {
    for (var y = 0; y < 20; y ++) {
      g.addObject(
        new e.GameObject(
          x*100, y*100,
          function(vector, state) {
            vector.translate(0,0);
          },
          g.state,
          new e.Sprite(
            './assets/bg_txt/txt0.png',
            100, 100, 300, 17, 0, 0, true
          )
        )
      )
    }
  }
      
}