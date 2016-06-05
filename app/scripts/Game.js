
function Game() {
    this.state = new GamePlayState()

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
        player = new Player("playerimage");
        enemy = new Enemy("playerimage");
        rect1 = new Rectangle(0, 512, 600, 10);
        rect2 = new Rectangle(300, 400, 600, 500);
    }
    this.run = function () {
        this.update();
        clearEventQueue();
        renderer.render(container);
    }

    this.update = function () {
        for (sprite in container.children) {
            container.children[sprite].update();
        }
    }
}
GamePlayState.prototype = Object.create(GameState.prototype)