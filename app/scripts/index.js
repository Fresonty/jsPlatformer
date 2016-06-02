var init = function () {
    renderer = PIXI.autoDetectRenderer(
        1000,
        600,
        { view: document.getElementById("canvas") }
    );
    container = new PIXI.Container();
    PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
    PIXI.loader
        .add("playerimage", "./resources/img/player.png")
        .load(setup);

    function setup() {
        game.mainloop()
    }
}
