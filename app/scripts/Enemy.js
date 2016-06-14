function Enemy(texturename) {
    Mob.call(this, texturename);

    // Components
    this.components.push(
        physics = new StatePhysicsComponent(this),
        ai = new AgressiveAiComponent(this, player),
        graphics = new GraphicsComponent(this)
    );
}
Enemy.prototype = Object.create(Mob.prototype)