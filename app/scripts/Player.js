function Player(texturename) {
    this.texturename = texturename;
    this.texture = PIXI.loader.resources[this.texturename].texture;
    PIXI.Sprite.call(this, this.texture);
    container.addChild(this);
    this.scale.set(4, 4);

    this.state = new PlayerJumpingState(this);

    this.vel = {
        x: 0,
        y: 0,
    }

    this.update = function () {
        this.state.handleEvents(this);
        this.state.update(this);
    }
    
    this.move_x = function () {
        this.position.x += this.vel.x;
        var collisions = physics.getCollisions(this, container)
        if (collisions.length > 0) {
            if (this.vel.x > 0) {
                this.vel.x = 0;
                this.position.x = collisions[0].x - this.width;
            }
            else if (this.vel.x < 0) {
                this.vel.x = 0;
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
}
Player.prototype = Object.create(PIXI.Sprite.prototype)


function PlayerState(caller) {
    this.caller = caller
    this.handleEvents = function () {
        for (event in eventQueue) {
            this.handleEvent(eventQueue[event]);
        }
    }

    this.update = function () {
        this.caller.vel.y = physics.applyGravity(this.caller.vel.y);
        this.caller.move_x();
        this.caller.move_y();
    }
}

function PlayerStandingState(caller) {
    PlayerState.call(this, caller);
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
PlayerStandingState.prototype = Object.create(PlayerState.prototype);

function PlayerJumpingState(caller) {
    PlayerState.call(this, caller);
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
PlayerJumpingState.prototype = Object.create(PlayerState.prototype);