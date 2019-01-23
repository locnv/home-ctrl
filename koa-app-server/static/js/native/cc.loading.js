/**
 * Base Controller base canvas
 *
 * Created by locnv on 10/8/18.
 */
/* global console */
/* global BaseCtrl */

function LoadingCtrl(parent) {
  "use strict";

  this.uber('constructor', parent);

  this.showGuideGrid = true; // set to false to hide the drawing assistance grid
  this.animateTheLoader = true; // set to false to disable animation and see the static drawing
  this.rotateAngle = 0;
}

LoadingCtrl.inherits(BaseCtrl);

/* Prototyping */

LoadingCtrl.prototype._render = _render;

/* Implementation */

function _render(g) {
  var renderFn = (this.animateTheLoader ? loadingAnimation : loadingDrawing);
  renderFn.call(this, g);

  g.font = "30px Arial";
  g.fillText("loading ...", 10, 50);
}

function renderGuideGrid(g, gridPixelSize, color) {
  g.save();
  g.lineWidth = 0.5;
  g.strokeStyle = color;

  // horizontal grid lines
  for(var i = 0; i <= this.mCanvas.height; i = i + gridPixelSize)   {
    drawLine.call(this, g, 0, i, this.mCanvas.width, i);
  }

  // vertical grid lines
  for(var j = 0; j <= this.mCanvas.width; j = j + gridPixelSize)  {
    drawLine.call(this, g, j, 0, j, this.mCanvas.height);
  }

  g.restore();
}

function drawLine(g, x1, y1, x2, y2) {
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x2, y2);
  g.closePath();
  g.stroke();
}

var lines = [
  { x1: 150, y1: 120, x2: 150, y2: 50, color: 'rgba(255, 255, 255, 1)'},
  { x1: 130, y1: 130, x2: 80, y2: 80, color: 'rgba(255, 255, 255, 0.8)'},
  { x1: 120, y1: 150, x2: 50, y2: 150, color: 'rgba(255, 255, 255, 0.5)'},
  { x1: 130, y1: 170, x2: 80, y2: 220, color: 'rgba(255, 255, 255, 0.35)'},
  { x1: 150, y1: 180, x2: 150, y2: 250, color: 'rgba(255, 255, 255, 0.2)'}
];

function loadingDrawing(g) {
  g.save();

  var width = this.mCanvas.width, height = this.mCanvas.height;

  g.beginPath();
  g.fillStyle = "cyan";
  g.fillRect(0, 0, width, height);
  g.stroke();

  if (this.showGuideGrid) {
    renderGuideGrid.call(this, g, 20, "red");
  }

  g.translate(150, 150);
  g.rotate(this.rotateAngle * Math.PI/180);
  g.translate(-150, -150);

  g.beginPath();
  g.fillStyle = "white";
  g.lineWidth = 15;
  g.lineCap = "round";

  for(var i = 0; i < lines.length; i++) {
    var line = lines[i];

    g.strokeStyle = line.color;
    g.moveTo(line.x1, line.y1);
    g.lineTo(line.x2, line.y2);
    g.stroke();
  }

  g.closePath();
  g.save();
  g.restore();
}

function loadingAnimation(g) {
  this.mCanvas.width = this.mCanvas.width; // redraw this.mCanvas for animation effect

  loadingDrawing.call(this, g);

  this.rotateAngle += 5;
  if (this.rotateAngle > 360) {
    this.rotateAngle = 5;
  }

  setTimeout(loadingAnimation.bind(this, g), 30);
}
