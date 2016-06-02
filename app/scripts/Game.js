function GameState() {
    this.enter = function () { };
    this.run = function () { console.log("run") };
}
function PlayState() {
    GameState.call(this)
    this.update = function () {
        for (sprite in container.children) {
            container.children[sprite].update();
        }
    }
    this.run = function () {
        this.update()
        clearEventQueue();
        renderer.render(container);
    }
}

    function Game() {
        this.play = new PlayState(),

        this.state = null,
        this.init = function () {
            this.rect1 = new Rectangle();
            this.player = new Player("playerimage")
            this.state = this.play;
            this.mainloop();
        }.bind(this),

        this.mainloop = function () {
            this.state.run();
            requestAnimationFrame(this.mainloop)
        }.bind(this)
    }

