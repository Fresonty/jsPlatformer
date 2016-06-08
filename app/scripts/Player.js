function Player(texturename) {
    Mob.call(this, texturename);
    this.state = new PlayerJumpingState(this);

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


    this.move = function () {
        this.move_x();
        this.move_y();
    }

    this.move_x = function () {
        this.position.x += this.vel.x;
        var collisions = physics.getCollisions(this, container)
        if (collisions.length > 0) {
            if (this.vel.x > 0) {
                // this.vel.x = 0;
                this.position.x = collisions[0].x - this.width / 2;
            }
            else if (this.vel.x < 0) {
                // this.vel.x = 0;
                this.position.x = collisions[0].x + collisions[0].width;
            }
        }
    }

    this.move_y = function () {
        this.position.y += this.vel.y;
        var collisions = physics.getCollisions(this, container)
        if (collisions.length > 0) {
            if (this.vel.y > 0) {
                this.vel.y = 0;
                this.position.y = collisions[0].y - this.height / 2;
                this.state = new PlayerStandingState(this);
            }
            else if (this.vel.y < 0) {
                this.vel.y = 0;
                this.position.y = collisions[0].y + collisions[0].height;
            }
        }
        else {
            this.state = new PlayerJumpingState(this);
        }
    }
}
Player.prototype = Object.create(Mob.prototype)


function PlayerBaseState(caller) {
    MobBaseState.call(this, caller)
}

function PlayerStandingState(caller) {
    PlayerBaseState.call(this, caller);
    this.handleEvent = function (event) {
        switch (event.type) {
            case "MOVE":
                switch (event.direction) {
                    case "RIGHT":
                        this.caller.vel.x = this.caller.speed;
                        break;
                    case "LEFT":
                        this.caller.vel.x = - this.caller.speed;
                        break;
                    case "UP":
                        this.caller.vel.y = - 12;
                        this.caller.state = new EnemyJumpingState(this.caller);
                        break;
                }
                break;
            case "ATTACK":
                if (Math.abs(event.position.x - this.caller.x) < 200 && Math.abs(event.position.y - this.caller.y) < 200) {
                    console.log("Valid attack")
                    if (event.sender !== this.caller) {
                        this.caller.position.y = 10000;
                    }
                }
                break;
        }
    }
}
PlayerStandingState.prototype = Object.create(PlayerBaseState.prototype);

function PlayerJumpingState(caller) {
    PlayerBaseState.call(this, caller);
    this.handleEvent = function (event) {
        switch (event.keyCode) {
            case PLAYER_MOVE_UP:
                if (event.type === "keydown") {
                    null;
                }
                else if (event.type === "keyup") {
                    null;
                }
                break;

            case PLAYER_MOVE_DOWN:
                null;
                break;

            case PLAYER_MOVE_LEFT:
                if (event.type === "keydown") {
                    this.caller.vel.x = - this.caller.speed;
                }
                else if (event.type === "keyup" && this.caller.vel.x < 0) {
                    this.caller.vel.x = 0;
                }
                break;

            case PLAYER_MOVE_RIGHT:
                if (event.type === "keydown") {
                    this.caller.vel.x = this.caller.speed;
                }
                else if (event.type === "keyup" && this.caller.vel.x > 0) {
                    this.caller.vel.x = 0;
                }
                break;
        }
        switch (event.type) {
            case "ATTACK":
                if (Math.abs(event.position.x - this.caller.x) <= 200 && Math.abs(event.position.y - this.caller.y) <= 200) {
                    console.log("Valid attack")
                    if (event.sender !== this.caller) {
                        this.caller.position.y = 10000;
                    }
                }
                break;
        }
    }
}
PlayerJumpingState.prototype = Object.create(PlayerBaseState.prototype);