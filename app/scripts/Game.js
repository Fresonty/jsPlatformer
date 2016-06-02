var GameState = function() {
    this.enter = function() {};
    this.run = function() {};
}

var play = new GameState()
play.update = function() {
    console.log("1")
}
play.run = function() {
    play.update()
    renderer.render(container);
}

var game = {
    state: play.run,
    
    mainloop: function() {
        game.state();
        requestAnimationFrame(game.mainloop)
    },
}

