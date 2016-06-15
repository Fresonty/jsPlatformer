function Level() {
    this.load = function (file) {
        // Loads all the data from the file
        this.file = require("./levels/" + file)
        this.data = JSON.parse(JSON.stringify(this.file))
        this.tiles = this.data.layers[0].data
    }

    this.build = function () {
        // Makes tiles from file
        for (tile in this.tiles) {
            // 0 is the code for nothing
            if (this.tiles[tile] != 0) {
                // Position Tile based on position in array
                new Tile(tile % this.data.layers[0].width * TILESIZE + TILESIZE / 2, parseInt(tile / this.data.layers[0].width) * TILESIZE + TILESIZE / 2, this.tiles[tile])
            }
        }
    }
}

function Tile(x, y, key) {
    this.texture = PIXI.loader.resources["./resources/img/tilesheet.json"].textures[TileID[key]];
    PIXI.Sprite.call(this, this.texture);
    world.addChild(this)
    this.anchor.set(0.5, 0.5)
    
    this.position.x = x;
    this.position.y = y;

}
Tile.prototype = Object.create(PIXI.Sprite.prototype)