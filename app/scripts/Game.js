
function Game() {
    this.state = new GamePlayState;

    this.init = function () {
        this.state.init()
        this.mainloop();
    }

    this.mainloop = function () {
        this.state.run();
        requestAnimationFrame(this.mainloop)
    }.bind(this)
}


function GameState() {
    this.init = function () { };
    this.run = function () { };
    this.update = function () { };
}

function GamePlayState() {
    GameState.call(this);
    this.init = function () {
        level = new Level("level2.json");
        level.build();
        player = new Player("playerimage");
        enemy = new Enemy("playerimage");
        player.x = 100;
        Camera.setTarget(player);
    }

    this.run = function () {
        this.update();
        clearEventQueue();
        renderer.render(stage);
    }

    this.update = function () {
        for (sprite in updateObjects) {
            updateObjects[sprite].makeEvents();
        }
        for (sprite in updateObjects) {
            updateObjects[sprite].handleEvents();
        }
        Camera.update();
    }
}
GamePlayState.prototype = Object.create(GameState.prototype)