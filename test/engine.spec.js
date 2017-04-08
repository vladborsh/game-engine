describe('Creating full screen canvas', function () {
  var g = new e.Game ();
  var canvas = document.getElementsByTagName("canvas")[0];
  it('Canvas size should be full screen', function() {
    expect(canvas.width).toEqual(window.innerWidth);
    expect(canvas.height).toEqual(window.innerHeight);
  });
})