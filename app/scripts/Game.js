
function Game() {
    this.state = new PlayState()

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

function PlayState() {
    GameState.call(this);
    this.init = function () {
        player = new Player("playerimage");
        rect1 = new Rectangle(0, 512, 600, 10)
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
PlayState.prototype = Object.create(GameState.prototype)