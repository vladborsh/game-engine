class Keypad {

  constructor() {
    this.top = false;
    this.left = false;
    this.right = false;
    this.bottom = false;
    this.mouseclick = false;
    document.addEventListener("keydown",
      (e) => {
        if (e.keyCode == 87) this.top = true;
        if (e.keyCode == 65) this.left = true;
        if (e.keyCode == 83) this.bottom = true;
        if (e.keyCode == 68) this.right = true;
      }, false
    );
    document.addEventListener("keyup",
      (e) => {
        if (e.keyCode == 87) this.top = false;
        if (e.keyCode == 65) this.left = false;
        if (e.keyCode == 83) this.bottom = false;
        if (e.keyCode == 68) this.right = false;
      }, false
    );
  }

}

export default Keypad;