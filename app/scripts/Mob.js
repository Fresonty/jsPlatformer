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
}
Mob.prototype = Object.create(PIXI.Sprite.prototype)