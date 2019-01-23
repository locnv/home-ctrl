/**
 * Created by locnv on 10/11/18.
 */
var Particle = function (wWidth, wHeight) {
  this.x = wWidth * Math.random();
  this.y = wHeight * Math.random();
  this.vx = 4 * Math.random() - 2;
  this.vy = 4 * Math.random() - 2;
  this.Color = GetRandomColor();
};

Particle.prototype.Draw = function (ctx) {
  ctx.fillStyle = this.Color;
  ctx.fillRect(this.x, this.y, 2, 2);
};

Particle.prototype.Update = function (wWidth, wHeight) {
  this.x += this.vx;
  this.y += this.vy;

  if (this.x < 0 || this.x >= wWidth) {
    this.vx = -this.vx;
  }

  if (this.y < 0 || this.y > wHeight) {
    this.vy = -this.vy;
  }
};