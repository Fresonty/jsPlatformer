function Player(texturename) {
    Mob.call(this, texturename);
    this.state = new PlayerJumpingState(this);
}
Player.prototype = Object.create(Mob.prototype)


function PlayerBaseState(caller) {
    this.caller = caller
    this.handleEvents = function () {
        for (event in eventQueue) {
            this.handleEvent(eventQueue[event]);
        }
    }

    this.update = function () {
        this.caller.vel.y = physics.applyGravity(this.caller.vel.y);
        physics.move_x(this.caller);
        physics.move_y(this.caller);
    }
}

function PlayerStandingState(caller) {
    PlayerBaseState.call(this, caller);
    this.handleEvent = function (event) {
        switch (event.keyCode) {
            case PLAYER_MOVE_UP:
                if (event.type === "keydown") {
                    this.caller.vel.y = -12;
                    this.caller.state =  new PlayerJumpingState(this.caller);
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
                    this.caller.vel.x = - 4;
                }
                else if (event.type === "keyup" && this.caller.vel.x < 0) {
                    this.caller.vel.x = 0;
                }
                break;

            case PLAYER_MOVE_RIGHT:
                if (event.type === "keydown") {
                    this.caller.vel.x = 4;
                }
                else if (event.type === "keyup" && this.caller.vel.x > 0) {
                    this.caller.vel.x = 0;
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
                    this.caller.vel.x = - 4;
                }
                else if (event.type === "keyup" && this.caller.vel.x < 0) {
                    this.caller.vel.x = 0;
                }
                break;

            case PLAYER_MOVE_RIGHT:
                if (event.type === "keydown") {
                    this.caller.vel.x = 4;
                }
                else if (event.type === "keyup" && this.caller.vel.x > 0) {
                    this.caller.vel.x = 0;
                }
                break;
        }
    }
}
PlayerJumpingState.prototype = Object.create(PlayerBaseState.prototype);