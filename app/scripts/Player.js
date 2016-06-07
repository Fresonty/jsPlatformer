function Player(texturename) {
    Mob.call(this, texturename);
    this.state = new PlayerJumpingState(this);
    
    this.move = function() {
        this.move_x();
        this.move_y();
    }
    
    this.move_x = function () {
        this.position.x += this.vel.x;
        var collisions = physics.getCollisions(this, container)
        if (collisions.length > 0) {
            if (this.vel.x > 0) {
                // this.vel.x = 0;
                this.position.x = collisions[0].x - this.width;
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
                this.position.y = collisions[0].y - this.height;
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
    this.jump = function() {
        this.vel.y = - 12;
        this.state = new PlayerJumpingState(this);
    } 
}
Player.prototype = Object.create(Mob.prototype)


function PlayerBaseState(caller) {
    MobBaseState.call(this, caller)
}

function PlayerStandingState(caller) {
    PlayerBaseState.call(this, caller);
    this.handleEvent = function (event) {
        switch (event.keyCode) {
            case PLAYER_MOVE_UP:
                if (event.type === "keydown") {
                    this.caller.jump();
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
                if (Math.abs(event.position.x - this.caller.x) < 200 &&  Math.abs(event.position.y - this.caller.y) < 200) {
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