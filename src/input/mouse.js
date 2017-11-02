class Mouse {

  constructor() {
    this.mouseclick = false;
    document.addEventListener("onmousedown",
      (e) => {
        this.mouseclick = true;
      }, false
    );
    document.addEventListener("onmouseup",
      (e) => {
        this.mouseclick = false;
      }, false
    );
    document.addEventListener('contextmenu',
      (e) => {
        e.preventDefault()
      }, false
    );
  }

}

export default Mouse;