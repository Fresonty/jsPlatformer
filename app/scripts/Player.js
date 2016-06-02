function Player(texturename) {
    this.texturename = texturename;
    this.texture = PIXI.loader.resources[this.texturename].texture;
    PIXI.Sprite.call(this, this.texture)
    container.addChild(this);

    this.state = new StandingState;
    
    this.vel = {
        x: 0,
        y: 0,
    }

    this.update = function () {
        this.handleEvents();
        // this.update();
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

function PlayerState() {
    this.handleEvents = function () {
        for (event in eventQueue) {
            this.handleEvent(eventQueue[event]);
        }
    }
    this.update = function () {
        null;
    }
}

function StandingState() {
    PlayerState.call(this);
    this.handleEvent = function (event) {
        switch (event) {
            case PRESS_UP:
                return new JumpingState();
        }
    }
    this.update = function () {
    }
}
StandingState.prototype = Object.create(PlayerState.prototype)

function JumpingState() {
    PlayerState.call(this);
    this.handleEvent = function (event) {
        switch (event) {
            case PRESS_DOWN:
                console.log("DOWN PRESS")
        }
    }
}