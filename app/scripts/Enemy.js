function Enemy(texturename) {
    Mob.call(this, texturename);

    // Components
    this.state = new JumpingStateComponent(this);
    this.physics = new PhysicsComponent(this);
    this.ai = new AgressiveAiComponent(this, player);

    // Make Events
    this.makeEvents = function () {
        // Make sure Own Event Queue is empty
        this.ownEventQueue = [];
        this.ai.makeEvents();
    }

    // Handle Events, then update
    this.handleEvents = function () {
        this.vel.x = 0;
        this.physics.handleEvents();
        this.state.handleEvents(this);

        this.physics.update();
    }
}
Enemy.prototype = Object.create(Mob.prototype)