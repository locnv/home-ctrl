
class Piece {

  constructor(size) {
    this.size = size;
    this.isInitialized = false;
    this.box = { x: 0, y: 0, width: 0, height: 0 };
  }

  initialize(plateBox, idx) {
    let BoxHeight = 20;
    let w = plateBox.width - 0.02 * plateBox.width;
    let y = plateBox.height;

    let i = 0;
    while(i < idx) {
      w -= 0.1 * plateBox.width;
      y -= BoxHeight;
      i++;
    }

    w = Math.max(w, 20);

    this.box.x = plateBox.x + (plateBox.width - w) / 2;
    this.box.y = y;
    this.box.width = w;
    this.box.height = BoxHeight;
    this.isInitialized = true;

    //console.log(`initialize piece [${this.size}] -> ${JSON.stringify(this.box)}`);
  }

  updatePositions(plateBox, idx) {
    let BoxHeight = 20;
    let w = this.box.width;
    let y = plateBox.height;

    let i = 0;
    while(i < idx) {
      y -= BoxHeight;
      i++;
    }

    this.box.x = plateBox.x + (plateBox.width - w) / 2;
    this.box.y = y;
    this.box.width = w;
    this.box.height = BoxHeight;

    //console.log(`update poses piece [${this.size}] -> ${JSON.stringify(this.box)}`);
  }

  draw(ctx) {
    let box = this.box;
    ctx.fillStyle = 'blue';
    ctx.fillRect(box.x, box.y+1, box.width, box.height-2);
    ctx.stroke();

    if(Game.isDebug()) {
      ctx.save();
      ctx.font = "12px Arial";
      ctx.fillStyle = 'red';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(this.size, this.box.x + this.box.width / 2, this.box.y + this.box.height / 2);
      ctx.restore();
    }

  }

}
