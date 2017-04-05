window.onload = function() {

  var CAMERA_V = new a.Vector(0, 0);
  var CAMERA_MAX_V = 20; // max velocity in one directionawd
  var CAMERA_MIN_V = -20; // min velocity in one directionawd
  var CAMERA_A = new a.Vector(0, 0); // acceleration
  var CAMERA_A_BOOST = 1.5; // acceleration boost is key pressed
  var CAMERA_A_BRAKING = 0.5; // acceleration boost is key pressed

  var g = new e.Game(window.innerWidth, window.innerHeight, stateCalllback);

  function stateCalllback(state) { 
    if (state.left) {
      CAMERA_A.x = -CAMERA_A_BOOST 
    } else if (state.right) {
      CAMERA_A.x = CAMERA_A_BOOST
    } else {
      CAMERA_A.x = 0
    }
    if (state.top) {
      CAMERA_A.y = -CAMERA_A_BOOST 
    } else if (state.bottom) {
      CAMERA_A.y = CAMERA_A_BOOST
    } else {
      CAMERA_A.y = 0
    }
  };

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
        console.log(state);
        CAMERA_V.x += ((CAMERA_V.x < CAMERA_MAX_V) && (CAMERA_V.x > CAMERA_MIN_V) && state.right) ? CAMERA_A.x : 0;
        CAMERA_V.x += ((CAMERA_V.x < CAMERA_MAX_V) && (CAMERA_V.x > CAMERA_MIN_V) && state.left) ? CAMERA_A.x : 0;
        CAMERA_V.y += ((CAMERA_V.y < CAMERA_MAX_V) && (CAMERA_V.y > CAMERA_MIN_V) && state.top) ? CAMERA_A.y : 0;
        CAMERA_V.y += ((CAMERA_V.y < CAMERA_MAX_V) && (CAMERA_V.y > CAMERA_MIN_V) && state.bottom) ? CAMERA_A.y : 0;

        CAMERA_V.x -= (!state.right && CAMERA_V.x != 0 && CAMERA_V.x > 0) ? CAMERA_A_BRAKING : 0;
        CAMERA_V.x -= (!state.left && CAMERA_V.x != 0 && CAMERA_V.x < 0) ? -CAMERA_A_BRAKING : 0;
        CAMERA_V.y -= (!state.top && CAMERA_V.y != 0 && CAMERA_V.y < 0) ? -CAMERA_A_BRAKING : 0;
        CAMERA_V.y -= (!state.bottom && CAMERA_V.y != 0 && CAMERA_V.y > 0) ? CAMERA_A_BRAKING : 0;

        console.log(CAMERA_V);
        //console.log(CAMERA_A);
        vector.translateVec(CAMERA_V);
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