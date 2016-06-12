
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
        player = new Player("playerimage");
        enemy = new Enemy("playerimage");
        player.x = 100;
        rect1 = new Rectangle(0, 100, 600, 10);
        rect2 = new Rectangle(500, 500, 600, 100);
    }
    
    this.run = function () {
        this.update();
        clearEventQueue();
        renderer.render(container);
    }

    this.update = function () {
        for (sprite in container.children) {
            try {
                container.children[sprite].makeEvents();
            }
            catch (err) {
                null;
            }
        }
        for (sprite in container.children) {
            try {
                container.children[sprite].handleEvents();
            }
            catch (err) {
                null;
            }
        }
    }
}
GamePlayState.prototype = Object.create(GameState.prototype)