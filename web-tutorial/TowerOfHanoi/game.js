class Game {

  static log(msg) {
    console.log(msg);
  }

  static isDebug() {
    return true;
  }

  constructor(canvas, nbPiece) {
    Game.log('Game constructor.');

    this.gameId = new Date().getTime();
    this.canvas = canvas;
    this.plates = [];
    this.nbPiece = nbPiece;
    this.isFinished = false;
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

    let n = this.nbPiece;
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

    if(this.isFinished) {
      return;
    }

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
    if(this.selectedPlate1 === null){
      if(!plate.isClear()) {
        this.selectedPlate1 = plate;
        plate.selectPiece();

        console.log('Select plate -> ' + plate.id);
      }
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
    this.checkGameFinish();
    this.draw();
    if(this.updateThread) {
      clearTimeout(this.updateThread);
    }
    this.updateThread = setTimeout(this.update.bind(this), 5000);

    console.log('update game -> ' + this.gameId);
  }

  checkGameFinish() {
    let idx = this.plates.length - 1;
    let targetPlate = this.plates[idx];
    this.isFinished = (targetPlate.pieces.length === this.nbPiece);
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

    if(this.isFinished) {
      ctx.font = "32px Arial";
      ctx.fillStyle = 'blue';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText('You Win!', box.width / 2, box.height / 2);
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

  resolveGame(ulContainer) {
    let steps = [];
    this.movePieces(this.nbPiece, 0, 2, 1, steps);
    console.log('Game over -> ', steps);

    this.simulateGameSolution(steps, ulContainer);
  }

  simulateGameSolution(steps, ulContainer) {
    if(steps.length === 0) {
      return;
    }

    let step = steps.shift();

    let li = document.createElement('li');
    ulContainer.appendChild(li);
    li.innerHTML = `Move ${step.id} from ${step.from + 1} --> ${step.to + 1}`;

    let srcIdx = step.from;
    let destIdx = step.to;

    let p = this.plates[srcIdx].popPiece();
    this.plates[destIdx].pushPiece(p);
    this.update();

    setTimeout(this.simulateGameSolution.bind(this, steps, ulContainer), 500);

  }

  movePieces(n, src, dest, mid, arr) {
    if(n === 0) {
      return;
    }

    this.movePieces(n-1, src, mid, dest, arr);
    arr.push({
      id: n,
      from: src,
      to: dest
    });
    console.log(`Move ${n} from ${src} -> ${dest}`);

    this.movePieces(n-1, mid, dest, src, arr);
  }
}
