function Level() {
    null;
}

function Tile(x, y) {
    this.rectangle = new PIXI.Rectangle(0, 0, 16, 16)
    this.texture = PIXI.loader.resources["tilesheet"].texture;
    this.texture.frame = this.rectangle;
    PIXI.Sprite.call(this, this.texture);
    this.position.x = x;
    this.position.y = y;
    container.addChild(this);
}
Tile.prototype = Object.create(PIXI.Sprite.prototype)