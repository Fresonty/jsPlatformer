function Player(texturename) {
    Mob.call(this, texturename);
    this.state = new MobJumpingState(this);

    this.Up = keyboard(PLAYER_MOVE_UP);
    this.Up.action = new MobMoveEvent("UP")
    this.Down = keyboard(PLAYER_MOVE_DOWN);
    this.Down.action = new MobMoveEvent("DOWN")
    this.Left = keyboard(PLAYER_MOVE_LEFT);
    this.Left.action = new MobMoveEvent("LEFT")
    this.Right = keyboard(PLAYER_MOVE_RIGHT);
    this.Right.action = new MobMoveEvent("RIGHT")

    this.inputhandler = new Inputhandler(this, [this.Up, this.Down, this.Left, this.Right])
    
    this._makeEvents = this.makeEvents;
    this.makeEvents = function () {
        this.inputhandler.makeEvents();
        this._makeEvents();
        
    }
    this._handleEvents = this.handleEvents;
    this.handleEvents = function() {
        this._handleEvents();
    }
}
Player.prototype = Object.create(Mob.prototype)
