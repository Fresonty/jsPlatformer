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
    this.texture = PIXI.loader.resources["./resources/img/tilesheet.json"].textures[TileKeys[key]];
    PIXI.Sprite.call(this, this.texture);
    container.addChild(this)
    this.position.x = x;
    this.position.y = y;
    
}
Tile.prototype = Object.create(PIXI.Sprite.prototype)

TileKeys = {
    "W": "Wood.png",
    "G": "Grass.png",
    "S": "Stone.png"
}