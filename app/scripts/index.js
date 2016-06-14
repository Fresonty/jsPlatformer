var init = function () {
    renderer = PIXI.autoDetectRenderer(
        1000,
        600,
        { view: document.getElementById("canvas") }
    );
    // Containers for game objects
    container = new PIXI.Container();
    container.scale.set(4, 4)
    updateObjects = [];

    PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
    PIXI.loader
        .add("playerimage", "./resources/img/player.png")
        .add("tilesheet", "./resources/img/tilesheet.png")
        .add("./resources/img/tilesheet.json")
        .load(setup);

    function setup() {
        game = new Game();
        game.init();
    }
}
