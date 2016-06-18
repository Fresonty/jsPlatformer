Game = {
    // Game is the object to contain all game relevant things,
    // state specific things are stored in that state
    eventQueue: [],
    updateObjects: [],
    // state is just a reference to the state in Game.States 
    state: null,
    // Containers
    GUI: new PIXI.Container(),
    world: new PIXI.Container(),

    // Functions for global eventQueue
    addEvent: function (event) {
        this.eventQueue.push(event)
    },
    removeEvent: function (eventIndex) {
        this.eventQueue.splice(evendIndex, 1)
    },
    clearEventQueue: function () {
        this.eventQueue = [];
    },

    // Set up Game
    init: function () {
        // Set up containers
        this.GUI.scale.set(4, 4);
        stage.addChild(this.GUI);
        this.world.scale.set(4, 4);
        stage.addChild(this.world);

        // Kick off game
        this.state = this.States.MainMenu;
        this.state.init();
        this.mainloop();
    },

    // Main Game loop
    mainloop: function () {
        this.state.run();
        // Must bind 'this'
        requestAnimationFrame(this.mainloop.bind(this));
    },

    // All Game states
    States: {
        // Play state for game
        Play: {
            init: function () {
                Game.clearEventQueue();
                Game.GUI.children = [];
                Game.world.children = [];
                Game.updateObjects = [];

                this.level = new Level("level2.json");
                this.level.build();
                this.player = new Player("playerimage");
                this.enemy = new Enemy("playerimage");
                this.player.x = 100;
                Camera.setTarget(this.player);
            },

            run: function () {
                this.update();
                Game.clearEventQueue();
                renderer.render(stage);
            },

            update: function () {
                for (sprite in Game.updateObjects) {
                    Game.updateObjects[sprite].makeEvents();
                }
                for (sprite in Game.updateObjects) {
                    Game.updateObjects[sprite].handleEvents();
                }
                for (event in Game.eventQueue) {
                    switch (Game.eventQueue[event].type) {
                        case "DIED":
                            if (Game.eventQueue[event].mob instanceof Player) {
                                Game.state.init();
                                return;
                            }
                            break;
                    }
                }
                Camera.update();
            }
        },

        MainMenu: {
            init: function() {
                this.startButton = new Button(40, 40, 40, 40, 0x66CCFF, function() 
                {Game.state = Game.States.Play;
                        Game.state.init();})
            },
            run: function() {
                this.startButton.update();
                renderer.render(stage);
            }
        }
    }
}

