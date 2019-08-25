
class Plate {

  constructor(id, box) {
    this.id = id;
    this.box = box;
    this.pieces = [];
  }

  getBox() {
    return this.box;
  }

  draw(ctx) {
    let box = this.box;
    ctx.strokeStyle = 'grey';
    ctx.lineWidth = '1';
    ctx.beginPath();
    ctx.rect(box.x + 1, box.y + 1, box.width - 2, box.height - 2);
    ctx.stroke();

    let xCenter = box.x + box.width / 2;
    let r = 0.05 * box.width;
    let yTop = box.height - 0.75 * box.height;
    // Center horizontal line
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(xCenter - r, yTop, 2 * r, box.height - yTop);
    ctx.stroke();

    for(let i = 0; i < this.pieces.length; i++) {
      this.pieces[i].draw(ctx);
    }

    if(Game.isDebug()) {
      let text = `p[${this.id}] -> ${this.pieces.length}`;
      ctx.save();
      ctx.fillStyle = 'red';
      ctx.font = "15px Arial";

      ctx.fillText(text, this.box.x + 10, this.box.y + 20);
      ctx.restore();
    }

  }

  pushPiece(piece) {
    if(!this.canPush(piece)) {
      console.error('Cannot push more piece on this plate['+ this.id +']');
      return false;
    }

    this.pieces.push(piece);
    if(!piece.isInitialized) {
      piece.initialize(this.box, this.pieces.length);
    } else {
      piece.updatePositions(this.box, this.pieces.length);
    }

  }

  canPush(piece) {
    if(this.pieces.length === 0) {
      return true;
    }

    let lastPiece = this.peekPiece();

    return (lastPiece.size > piece.size);

  }

  popPiece() {
    if(this.isClear()) {
      throw new Error('No piece.');
    }

    return this.pieces.pop();

  }

  peekPiece() {
    if(this.isClear()) {
      throw new Error('No piece.');
    }

    let idx = this.pieces.length - 1;
    return this.pieces[idx];
  }

  isClear() {
    return (this.pieces.length === 0);
  }

  test(x, y) {
    let box = this.box;
    return (x > box.x && y > box.y && x < (box.x+box.width) && y < (box.y + box.height));
  }

  selectPiece() {
    let top = this.peekPiece();
    //top.box.y = 0.25 * this.box.height;
    top.box.y -= 75;
  }

  unSelectPiece() {
    let top = this.peekPiece();
    top.box.y += 75;
  }

}