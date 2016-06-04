function Rectangle() {
    PIXI.Graphics.call(this);
    //this.lineStyle(4, 0xFF3300, 1);
    this.beginFill(0x66CCFF);
    this.drawRect(0, 0, 600, 300);
    this.endFill();
    this.x = 0;
    this.y = 128;
    container.addChild(this);
    this.update = function() {
        null;
    }
}
Rectangle.prototype = Object.create(PIXI.Graphics.prototype)