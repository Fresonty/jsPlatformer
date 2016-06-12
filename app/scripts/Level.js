function Level() {
    this.level1 = [
        ["W", "W", "S"],
        ["S", "S", "W"]
    ];
    this.build = function() {
        for (row in this.level1) {
            for (char in this.level1[row]) {
                new Tile(char * TILESIZE, row * TILESIZE, this.level1[row][char])
            }
        }
    }
}

function Tile(x, y, key) {
    this.rectangle = new PIXI.Rectangle(TileKeys[key][0][0], TileKeys[key][0][1], TILESIZE, TILESIZE);
    this.texture = PIXI.loader.resources["tilesheet"].texture;
    this.texture.frame = this.rectangle;
    PIXI.Sprite.call(this, this.texture);
    this.position.x = x;
    this.position.y = y;
    container.addChild(this);
}
Tile.prototype = Object.create(PIXI.Sprite.prototype)

TileKeys = {
    "W": [[0, 0], "Wood"],
    "G": [[TILESIZE, 0], "Grass"],
    "S": [[0, TILESIZE], "Stone"]
}