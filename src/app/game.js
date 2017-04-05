window.onload = function() {
  var g = new e.Game();
  g.addCursorGameObject(
    new e.Sprite(
      './assets/aim.png',
      50, 50, 500, 20, 0, 4, true
    )
  );
  g.loop();

  console.log(g.state);

  g.addObject(
    new e.GameObject(
      100, 100,
      function(vector, state) {
        vector.x += (state.left) ? -10 : 0 + (state.right) ? 10 : 0;
        vector.y += (state.top) ? -10 : 0 + (state.bottom) ? 10 : 0;
        console.log(vector.x, vector.y );
      },
      g.state
    )
  )
  
}