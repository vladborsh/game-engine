# GLight

GLight is a light-weight javascript game engine with support for rendering, collision detection, resource management. Collision detection is based on an optimized SAP algorithm implemetation. Main game loops can be switched in accordins to current game stage

In addition, standard engine functionality includes ability to create linking between objects for subscription or creation dependent conversion (change inner state by parameters) function

[![Build Status](https://travis-ci.org/vladborsh/game-light.svg?branch=master)](https://travis-ci.org/vladborsh/game-light)

## Demos

The demo contains simple top-down shooter game

* [dark-space](https://vladborsh.github.io/)

## Usage

### Createing a game object

```js
var g = new e.Game(window.innerWidth, window.innerHeight);
g.loop();
```

Creating full screen canvas

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


