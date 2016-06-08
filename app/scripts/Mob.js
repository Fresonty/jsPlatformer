function Mob(texturename) {
    this.texturename = texturename;
    this.texture = PIXI.loader.resources[this.texturename].texture;
    PIXI.Sprite.call(this, this.texture);
    container.addChild(this);
    this.scale.set(4, 4);
    this.anchor.set(0.5, 0.5);
    this.state = null;
    this.ownEventQueue = [];
    
    this.vel = {
        x: 0,
        y: 0,
    }
    this.speed = 4;
    
    this.makeEvents = function () {
        null;
    }
    
    this.handleEvents = function() {
        this.vel.x = 0;
        this.state.handleEvents(this);
        this.state.update(this);
        this.ownEventQueue = [];
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
                this.state = new MobStandingState(this);
            }
            else if (this.vel.y < 0) {
                this.vel.y = 0;
                this.position.y = collisions[0].y + collisions[0].height;
            }
        }
        else {
            this.state = new MobJumpingState(this);
        }
    }
}
Mob.prototype = Object.create(PIXI.Sprite.prototype)

function MobBaseState(caller) {
    this.caller = caller
    this.update = function () {
        this.caller.vel.y = physics.applyGravity(this.caller.vel.y);
        this.caller.move();
    }
    this.handleEvents = function () {
        for (event in eventQueue) {
            this.handleEvent(eventQueue[event]);
        }
        for (event in this.caller.ownEventQueue) {
            this.handleEvent(this.caller.ownEventQueue[event]);
        }
    }
    
    this.handleEvent = function() {
        null;
    }
}

function MobStandingState(caller) {
    MobBaseState.call(this, caller)
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
                        this.caller.state = new MobJumpingState(this.caller);
                        break;
                }
                break;
            case "ATTACK":
                if (Math.abs(event.position.x - this.caller.x) < 250 && Math.abs(event.position.y - this.caller.y) < 250) {
                    console.log("Valid attack")
                    if (event.sender !== this.caller) {
                        this.caller.position.y = 10000;
                    }
                }
                break;
        }
    }
}
MobStandingState.prototype = Object.create(MobBaseState.prototype)

function MobJumpingState(caller) {
    MobBaseState.call(this, caller)
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
                }
                break;
            case "ATTACK":
                if (Math.abs(event.position.x - this.caller.x) < 250 && Math.abs(event.position.y - this.caller.y) < 250) {
                    if (event.sender !== this.caller) {
                        this.caller.position.y = 10000;
                    }
                }
                break;
        }
    }
}
MobJumpingState.prototype = Object.create(MobBaseState.prototype)