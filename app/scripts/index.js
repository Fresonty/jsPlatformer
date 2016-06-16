var init = function () {
    renderer = PIXI.autoDetectRenderer(
        1000,
        600,
        { view: document.getElementById("canvas") }
    );
    // Containers for game objects
    stage = new PIXI.Container();
    // Render Stage, which contains the gameworld + the gui
    world = new PIXI.Container();
    world.scale.set(4, 4);
    GUI = new PIXI.Container();
    GUI.scale.set(4, 4);
    stage.addChild(world);
    stage.addChild(GUI);
    updateObjects = [];

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
