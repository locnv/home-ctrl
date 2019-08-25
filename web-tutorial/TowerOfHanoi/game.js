class Game {

  static log(msg) {
    console.log(msg);
  }

  static isDebug() {
    return true;
  }

  constructor(canvas) {
    Game.log('Game constructor.');

    this.gameId = new Date().getTime();
    this.canvas = canvas;
    this.plates = [];
    this.selectedAPiece = false;
    this.selectedPiece = null;
    this.selectedPlate1 = null;
    this.selectedPlate2 = null;

    this.canvas.addEventListener('click', Game.handleClickEvent.bind(this), false);

    let x = 0, y = 0, width = this.canvas.width, height = this.canvas.height;
    let plateWidth = width / 3;

    let rect1 = {
      x: x, y: y,
      width: plateWidth,
      height: height
    };

    let plate1 = new Plate(1, rect1);
    this.plates.push(plate1);

    let n = 5;
    for(let i = 0; i < n; i++) {
      let piece = new Piece(n - i);
      //piece.initialize(rect1, i);
      plate1.pushPiece(piece);
    }

    let rect2 = {
      x: plateWidth, y: y,
      width: plateWidth,
      height: height
    };
    let plate2 = new Plate(2, rect2);
    this.plates.push(plate2);

    let rect3 = {
      x: 2 * plateWidth, y: y,
      width: plateWidth,
      height: height
    };
    let plate3 = new Plate(3, rect3);
    this.plates.push(plate3);

  }

  static handleClickEvent(e) {

    let plate = null;
    for(let i = 0; i < this.plates.length; i++) {
      if(this.plates[i].test(e.x, e.y) === true) {
        plate = this.plates[i];
        break;
      }
    }

    if(plate == null) {
      return;
    }

    // not yet selected
    if(this.selectedPlate1 == null){
      this.selectedPlate1 = plate;
      plate.selectPiece();

      console.log('Select plate -> ' + plate.id);
    }

    // un-select
    else if(this.selectedPlate1 === plate) {
      this.selectedPlate1.unSelectPiece();
      this.selectedPlate1 = null;
      console.log('un-select plate');
    }
    // move selected piece to targeted plate
    else {
      // Move from selectedPlate1 to plate
      // TODO Moving animation
      if(plate.canPush(this.selectedPlate1.peekPiece())) {
        //console.log('Moving a piece: '+ this.selectedPlate1.id + ' -> ' + plate.id);
        let p = this.selectedPlate1.popPiece();
        plate.pushPiece(p);

        this.selectedPlate1 = null;
      } else {
        console.warn('Cannot push into -> p#' + plate.id);
      }

    }

    this.update();

  }

  start() {
    console.log('start game -> ' + this.gameId);
    this.update();
  }

  stop() {
    console.log('Ready to stop game');
    if(this.updateThread) {
      clearTimeout(this.updateThread);
      console.log('Stop game -> ' + this.gameId);
    }

    this.canvas.removeEventListener('click', Game.handleClickEvent);
  }

  update() {
    this.draw();
    if(this.updateThread) {
      clearTimeout(this.updateThread);
    }
    this.updateThread = setTimeout(this.update.bind(this), 5000);

    console.log('update game -> ' + this.gameId);
  }

  draw() {
    //Game.log('Drawing ' + new Date());
    let ctx = this.canvas.getContext('2d');
    let box = {
      x: 0, y: 0, width: this.canvas.width, height: this.canvas.height
    };

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, box.width, box.height);
    ctx.stroke();

    for(let i = 0; i < this.plates.length; i++) {
      this.plates[i].draw(ctx);
    }

    //Game.drawSelectedPiece(ctx);

    Game.drawGrid(ctx, box);
  }

  static drawSelectedPiece(ctx) {
    if(this.selectedPiece == null) {
      return;
    }

    console.log('Draw selected piece');
    this.selectedPiece.draw(ctx);
  }

  static drawGrid(ctx, box) {

    ctx.strokeStyle = '#000';
    ctx.lineWidth = '3';
    ctx.beginPath();
    ctx.rect(box.x, box.y, box.width, box.height);
    ctx.stroke();
  }
}
