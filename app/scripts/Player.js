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
    this.components.push(
        physics = new StatePhysicsComponent(this),
        inputhandler = new InputhandlerComponent(this, [this.Up, this.Down, this.Left, this.Right]),
        graphics = new GraphicsComponent(this)
    );
}
Player.prototype = Object.create(Mob.prototype)
