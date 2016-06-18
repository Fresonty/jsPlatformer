var init = function () {
    renderer = PIXI.autoDetectRenderer(
        1200,
        800,
        { view: document.getElementById("canvas") }
    );
    // Container for other containers
    stage = new PIXI.Container();
    // Render stage, which contains all other Containers in it

    PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
    PIXI.loader
        .add("playerimage", "./resources/img/player.png")
        .add("tilesheet", "./resources/img/tilesheet.png")
        .add("./resources/img/tilesheet.json")
        .load(setup);

    function setup() {
        Game.init();
    }
}
