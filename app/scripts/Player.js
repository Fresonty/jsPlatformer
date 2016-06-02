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
        this.position.y += this.vel.y;
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
        this.caller.position.x += caller.vel.x;
        this.caller.position.y += caller.vel.y;
    }
}

function StandingState(caller) {
    PlayerState.call(this, caller);
    this.handleEvent = function (event) {
        switch (event.keyIdentifier) {
            case "Up":
                this.caller.vel.y = -20;
                return new JumpingState(this.caller);
        }
    }
}
StandingState.prototype = Object.create(PlayerState.prototype)

function JumpingState(caller) {
    PlayerState.call(this, caller);
    this.handleEvent = function (event) {
        switch (event) {
            case PRESS_DOWN:
                console.log("DOWN PRESS")
        }
    }
}
JumpingState.prototype = Object.create(PlayerState.prototype)