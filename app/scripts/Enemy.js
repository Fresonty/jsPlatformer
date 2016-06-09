function Enemy(texturename) {
    Mob.call(this, texturename);

    // Components
    this.components.push(
        this.state = new JumpingStateComponent(this),
        this.physics = new PhysicsComponent(this),
        this.ai = new AgressiveAiComponent(this, player)
    );
}
Enemy.prototype = Object.create(Mob.prototype)