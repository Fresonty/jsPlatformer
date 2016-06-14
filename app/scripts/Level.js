function Level() {
    this.load = function(file) {
        // Loads all the data from the file
        this.file = require("./levels/" + file)
        this.data = JSON.parse(JSON.stringify(this.file))
        this.tiles = this.data.layers[0].data
    }
    
    this.build = function() {
        // Makes tiles from file
        for (tile in this.tiles) {
            if (this.tiles[tile] != 0) {
                    new Tile(tile % this.data.layers[0].width * TILESIZE + TILESIZE / 2, parseInt(tile / this.data.layers[0].width) * TILESIZE + TILESIZE / 2, this.tiles[tile])
            }
        }
    }
}

function Tile(x, y, key) {
    this.texture = PIXI.loader.resources["./resources/img/tilesheet.json"].textures[TileID[key]];
    PIXI.Sprite.call(this, this.texture);
    this.anchor.set(0.5, 0.5)
    container.addChild(this)
    this.position.x = x;
    this.position.y = y;
    
}
Tile.prototype = Object.create(PIXI.Sprite.prototype)