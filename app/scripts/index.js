var init = function () {
    renderer = PIXI.autoDetectRenderer(
        1000,
        600,
        { view: document.getElementById("canvas") }
    );
    PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
    PIXI.loader
        .add("playerimage", "./resources/img/player.png")
        .load(setup);

    function setup() {
        game = new Game();
        if (game) {
            game.init();
        }
    }
}
