window.onload = function() {


  var g = new e.Game(window.innerWidth, window.innerHeight);

  g.addCursorGameObject(
    new e.Sprite(
      './assets/aim2.png',
      100, 100, 300, 0, 4, true, false
    )
  );
  g.cursor.rotationByCursor = true;

  

  /* Filter */
  g.addObject(
    new e.GameObject(
      g.screen.center.x, 
      g.screen.center.y,
      function(vector, state, controller) {},
      g.state,
      new e.Sprite(
        './assets/filters/filter_1.png',
        2000, 2000, 300, 0, 0, true, true
      )
    )
  );

  /* Hero */
  g.addObject(
    new e.GameObject(
      g.screen.center.x, 
      g.screen.center.y,
      function(vector, state, controller) {
        controller.accelerate();
        controller.slip();
        vector.translateVec(controller.velocity);
      },
      g.state,
      new e.Sprite(
        './assets/hero/hero.png',
        120, 120, 400, 0, 5, true, false
      ),
      new e.Controller(
        new a.Vector(0, 0),
        new a.Vector(0, 0),
        g.state,
        2,
        10,
        1
      )
    )
  );


  g.setCamera(
    new e.Camera(
      g.screen.center.x,
      g.screen.center.y,
      function(vector, state, controller) {
        controller.accelerate();
        controller.slip();
        vector.translateVec(controller.velocity);
      },
      g.state,
      new e.Controller(
        new a.Vector(0, 0),
        new a.Vector(0, 0),
        g.state,
        1,
        10,
        1,
        g.worldList[0].vector
      )
    )
  );

  /* Set background */
  for (var x = 0; x < 20; x ++) {
    for (var y = 0; y < 20; y ++) {
      g.addObject(
        new e.GameObject(
          x*100, 
          y*100,
          function(vector, state) {
            vector.translate(0,0);
          },
          g.state,
          new e.Sprite(
            './assets/bg_txt/txt0.png',
            100, 100, 300, 0, 0, true, false
          )
        )
      )
    }
  }

  g.loop();
      
}