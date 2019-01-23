/**
 * Base Controller base canvas
 *
 * Created by locnv on 10/8/18.
 */
/* global console */

function BaseCtrl(parent) {
  this.mParent = parent;
  this.mCanvas = null;
  this.id = new Date().getTime();

  this.config = {
    border: {
      enabled: true,
      size: 5,
    },
  };
}

BaseCtrl.prototype.initialize = initialize;
BaseCtrl.prototype.update = update;
BaseCtrl.prototype.render = render;
BaseCtrl.prototype.invalid = invalid;

/* Implementation */

function initialize() {
  this.mCanvas = document.createElement('canvas');

  this.mCanvas.id = 'cc.base.' + this.id;

  this.mCanvas.width = this.mParent.offsetWidth;
  this.mCanvas.height = this.mParent.offsetHeight;
  this.mCanvas.style.zIndex = 8;
  this.mCanvas.style.position = 'absolute';
  this.mCanvas.style.border = '1px solid';
  this.mParent.appendChild(this.mCanvas);

  //this.invalid();
}

function update() {

  if(this._update) {
    this._udpate();
  }
}

function render() {
  var ctx = this.mCanvas.getContext("2d");
  //var width = this.mCanvas.width, height = this.mCanvas.height;
  //ctx.fillRect(0, 0, width, height);

  if(this.config.border.enabled) {
    drawBorder.call(this, ctx);
  }

  if(this._render) {
    this._render(ctx);
  }
}

function invalid() {
  this.render();
}

function drawBorder(g) {
  var width = this.mCanvas.width, height = this.mCanvas.height;

  g.beginPath();
  g.lineWidth = this.config.border.size;
  g.strokeStyle="red";
  g.rect(5, 5, width-10, height-10);
  g.stroke();
}
