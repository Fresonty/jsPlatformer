
Game = {
    // GLOBAL event queue
    eventQueue : [],
    world : new PIXI.Container(),

    addEvent : function(event) {
        this.eventQueue.push(event)
    },
    removeEvent : function(eventIndex) {
        this.eventQueue.splice(evendIndex, 1)
    },
    clearEventQueue : function() {
        this.eventQueue = [];
    },
    state: new GamePlayState(1),

    init: function () {
        this.world.scale.set(4, 4)
        stage.addChild(this.world);
        this.state.init();
        this.mainloop();
    },

    mainloop: function () {
        this.state.run();
        // Must bind 'this'
        requestAnimationFrame(this.mainloop.bind(this));
    },
}


function GameState() {
    this.init = function () { };
    this.run = function () { };
    this.update = function () { };
}

function GamePlayState(id) {
    this.id = id;
    GameState.call(this);
    this.init = function () {
        Game.clearEventQueue();
        Game.world.children = [];

        this.level = new Level("level2.json");
        this.level.build();
        this.player = new Player("playerimage");
        this.enemy = new Enemy("playerimage");
        this.player.x = 100;
        Camera.setTarget(this.player);
    }

    this.run = function () {
        this.update();
        Game.clearEventQueue();
        renderer.render(stage);
    }

    this.update = function () {
        for (sprite in updateObjects) {
            updateObjects[sprite].makeEvents();
        }
        for (sprite in updateObjects) {
            updateObjects[sprite].handleEvents();
        }
        for (event in Game.eventQueue) {
            switch (Game.eventQueue[event].type) {
                case "DIED":
                    if (Game.eventQueue[event].mob instanceof Player) {
                        Game.state = new GamePlayState(2);
                        updateObjects = [];
                        Game.state.init();
                        return;
                    }
                    break;
            }
        }
        Camera.update();
    }
}
GamePlayState.prototype = Object.create(GameState.prototype)