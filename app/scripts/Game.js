Game = {
    // Game is the object to contain all game relevant things,
    // state specific things are stored in that state
    eventQueue: [],
    updateObjects: [],
    guiUpdateObjects: [],
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
        this.GUI.scale.set(GUISCALE, GUISCALE);
        stage.addChild(this.GUI);
        this.world.scale.set(GAMESCALE, GAMESCALE);
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
        preInit: function() {
            Game.clearEventQueue();
            Game.GUI.children = [];
            Game.world.children = [];
            Game.updateObjects = [];
            Game.guiUpdateObjects = [];
        },
        // Play state for game
        Play: {
            init: function () {
                Game.States.preInit();

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
                // Check for Game-relevant events
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
            init: function () {
                Game.States.preInit();

                this.title = new PIXI.Text("JS Platformer!",{font : '50px Arial', fill : 0xFF3333});
                this.title.position.x = renderer.width / 2 / GUISCALE - this.title.width / 2;
                this.title.position.y = 30;
                Game.GUI.addChild(this.title);
                
                // Add buttons
                this.startButton = new Button(renderer.width / 2 / GUISCALE, renderer.height / 2 / GUISCALE, 200, 75, 0x8F79F9, 'Start Game!', function () {Game.state = Game.States.Play; Game.state.init();});
                this.exitButton = new Button(renderer.width / 2 / GUISCALE, renderer.height / 4 * 3 / GUISCALE, 200, 75, 0x999999, 'Exit', function () {var window = remote.getCurrentWindow(); window.close();});
            },
            run: function () {
                for (object in Game.guiUpdateObjects) {
                    if (Game.guiUpdateObjects[object] != undefined) {
                        Game.guiUpdateObjects[object].update();
                    }
                }
                renderer.render(stage);
            }
        }
    }
}

