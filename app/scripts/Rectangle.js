function Rectangle(x, y, width, height) {
    PIXI.Graphics.call(this);
    //this.lineStyle(4, 0xFF3300, 1);
    this.beginFill(0x66CCFF);
    this.drawRect(0, 0, width, height);
    this.endFill();
    this.x = x;
    this.y = y;
    //this.pivot.set(width / 2, height / 2);
    container.addChild(this);
}
Rectangle.prototype = Object.create(PIXI.Graphics.prototype)