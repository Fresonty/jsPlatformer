function Rectangle(x, y, width, height) {
    PIXI.Graphics.call(this);
    //this.lineStyle(4, 0xFF3300, 1);
    this.beginFill(0x66CCFF);
    this.drawRect(0, 0, width, height);
    this.endFill();
    this.x = x;
    this.y = y;
    container.addChild(this);
    this.update = function() {
        null;
    }
}
Rectangle.prototype = Object.create(PIXI.Graphics.prototype)