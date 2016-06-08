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
        for (event in this.caller.ownEventQueue) {
            this.handleEvent(this.caller.ownEventQueue[event]);
        }
    }
    
    this.handleEvent = function() {
        null;
    }
}
