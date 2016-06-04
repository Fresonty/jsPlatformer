function Mob(texturename) {
    this.texturename = texturename;
    this.texture = PIXI.loader.resources[this.texturename].texture;
    PIXI.Sprite.call(this, this.texture);
    container.addChild(this);
    this.scale.set(4, 4);
    
    this.state = new MobJumpingState(this);
    
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

function MobState(caller) {
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

function MobStandingState(caller) {
    MobState.call(this, caller);
    this.handleEvent = function() {
        
    }
}
MobStandingState.prototype = Object.create(MobState.prototype);

function MobJumpingState(caller) {
    MobState.call(this, caller);
    this.handleEvent = function() {
        
    }
}
MobJumpingState.prototype = Object.create(MobState.prototype);
