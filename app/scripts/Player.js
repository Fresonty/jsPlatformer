function Player(texturename) {
    Mob.call(this, texturename);
    
    // Necessary for inputhandler
    this.Up = keyboard(PLAYER_MOVE_UP);
    this.Up.action = new MobMoveEvent("UP")
    this.Down = keyboard(PLAYER_MOVE_DOWN);
    this.Down.action = new MobMoveEvent("DOWN")
    this.Left = keyboard(PLAYER_MOVE_LEFT);
    this.Left.action = new MobMoveEvent("LEFT")
    this.Right = keyboard(PLAYER_MOVE_RIGHT);
    this.Right.action = new MobMoveEvent("RIGHT")

    // Components
    this.state = new JumpingStateComponent(this);
    this.physics = new PhysicsComponent(this);
    this.inputhandler = new InputhandlerComponent(this, [this.Up, this.Down, this.Left, this.Right])
    
    // Make Events
    this.makeEvents = function () {
        // Make sure Own Event Queue is empty
        this.ownEventQueue = [];
        this.inputhandler.makeEvents();
    }
    
    // Handle Events, then update
    this.handleEvents = function () {
        this.vel.x = 0;
        this.physics.handleEvents();
        this.state.handleEvents(this);

        this.physics.update();
    }
}
Player.prototype = Object.create(Mob.prototype)
