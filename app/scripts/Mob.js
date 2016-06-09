function Mob(texturename) {
    // Init Sprite
    this.texturename = texturename;
    this.texture = PIXI.loader.resources[this.texturename].texture;
    PIXI.Sprite.call(this, this.texture);

    // Setup
    container.addChild(this);
    this.scale.set(4, 4);
    this.anchor.set(0.5, 0.5);

    // Attributes
    this.ownEventQueue = [];
    this.speed = 4;
    this.vel = {
        x: 0,
        y: 0,
    }

    // Components
    this.components = [];
    
    // Make Events
    this.makeEvents = function() {
        // Make sure Own Event Queue is empty
        this.ownEventQueue = [];
        for (component in this.components) {
            this.components[component].makeEvents();
        }
    }
    // Handle Events, then update
    this.handleEvents = function() {
        this.vel.x = 0;
        for (component in this.components) {
            this.components[component].handleEvents();
        }
        for (component in this.components) {
            this.components[component].update();
        }
    }
}
Mob.prototype = Object.create(PIXI.Sprite.prototype)