function Player(texturename) {
    this.texturename = texturename;
    this.texture = PIXI.loader.resources[this.texturename].texture;
    PIXI.Sprite.call(this, this.texture)
    container.addChild(this);

    this.state = new StandingState(this);

    this.vel = {
        x: 0,
        y: 0,
    }

    this.update = function () {
        this.handleEvents(this);
        this.state.update(this);

        this.vel.y = physics.applyGravity(this.vel.y);

        this.position.x += this.vel.x;
        var collisions = physics.getCollisions(this, container)
        if (collisions.length > 0) {
            if (this.vel.x > 0) {
                this.vel.x = 0;
                this.position.x = collisions[0].x - this.width;
            }
            else if (this.vel.x < 0) {
                this.vel.x = 0;
                this.position.x = collisions[0].x + this.width;
            }
        }

        this.position.y += this.vel.y;
        var collisions = physics.getCollisions(this, container)
        if (collisions.length > 0) {
            if (this.vel.y > 0) {
                this.vel.y = 0;
                this.position.y = collisions[0].y - this.height;
                this.state = new StandingState(this);
            }
            else if (this.vel.y < 0) {
                this.vel.y = 0;
                this.position.y = collisions[0].y + this.height;
            }
        }

    }
    this.handleEvents = function () {
        newstate = this.state.handleEvents();
        if (newstate != null) {
            this.state = newstate;
        }
    }
}
Player.prototype = Object.create(PIXI.Sprite.prototype)


function PlayerState(caller) {
    this.caller = caller
    this.handleEvents = function () {
        for (event in eventQueue) {
            var newstate = this.handleEvent(eventQueue[event]);
        }
        if (newstate != null) {
            return newstate;
        }
    }
    this.update = function () {
        null;
    }
}

function StandingState(caller) {
    PlayerState.call(this, caller);
    this.handleEvent = function (event) {
        switch (event.keyCode) {
            case PLAYER_MOVE_UP:
                if (event.type === "keydown") {
                    this.caller.vel.y = -32;
                    return new JumpingState(this.caller);
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
                else if (event.type === "keyup") {
                    this.caller.vel.x = 0;
                }
                break;

            case PLAYER_MOVE_RIGHT:
                if (event.type === "keydown") {
                    this.caller.vel.x = 4;
                }
                else if (event.type === "keyup") {
                    this.caller.vel.x = 0;
                }
                break;
        }
    }
}
StandingState.prototype = Object.create(PlayerState.prototype)

function JumpingState(caller) {
    PlayerState.call(this, caller);
    this.handleEvent = function (event) {
        switch (event) {
            case PLAYER_MOVE_DOWN:
                null;
        }
    }
}
JumpingState.prototype = Object.create(PlayerState.prototype)