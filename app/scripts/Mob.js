function Mob(texturename) {
    this.texturename = texturename;
    this.texture = PIXI.loader.resources[this.texturename].texture;
    PIXI.Sprite.call(this, this.texture);
    container.addChild(this);
    this.scale.set(4, 4);
    
    this.state = null;
    
    this.vel = {
        x: 0,
        y: 0,
    }
    this.speed = 4;
    
    this.update = function () {
        this._update();
        this.state.handleEvents(this);
        this.state.update(this);
    }
    this._update = function() {
        // reserved for child class
    }
    
    this.move = function() {
        null;
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
    }
    this.handleEvent = function() {
        null;
    }
}
