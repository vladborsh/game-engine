# Engine

Light-weight javascript 2d game engine with support of rendering, collision detection, resource management. Collision detection is based on an optimized SAP algorithm implemetation. Main game loops can be switched in according to current game stage

In addition, standard engine functionality includes ability to create linking between objects for subscription or creation dependent conversion (change inner state by parameters) function

[![Build Status](https://travis-ci.org/vladborsh/game-light.svg?branch=master)](https://travis-ci.org/vladborsh/game-light)

## Demos

## Usage

### Createing a game object

```js
var g = new e.Game(window.innerWidth, window.innerHeight);
g.loop();
```

Creating full screen canvas

### Loading data to media storage 

```js
  g.mediaStorage.add( 'aim',    './assets/aim2.png'             );
  g.mediaStorage.add( 'filter', './assets/filters/filter_1.png' );
  g.mediaStorage.add( 'hero',   './assets/hero/hero.png'        );
  g.mediaStorage.add( 'txt',    './assets/bg_txt/txt0.png'      );
```

Files are stored by key-value or key-folder pairs. By getting single item should be provided game object index in world list (this is memory management requirements and prevent memory leak after removal)

### Add new objects

```js
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
      g.mediaStorage.get('hero', g.world.length),
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
```
Create new object with pre-installed sprite and controller

### Set camera 

```js
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
```

Create camera object with linking to first game object in main loop. This is necessary to recognize the sequence vector


