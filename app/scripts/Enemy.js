function Enemy(texturename) {
    Mob.call(this, texturename);
    this.state = new MobBaseState(this);
    
    
}
Enemy.prototype = Object.create(Mob.prototype)