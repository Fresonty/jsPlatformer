// Events
function MobEvent(type) {
    this.type = type;
}

function MobMoveEvent(direction) {
    MobEvent.call(this, "MOVE");
    this.direction = direction;
}

function MobAttackEvent(sender) {
    MobEvent.call(this, "ATTACK");
    this.sender = sender;
    this.position = {
        x: this.sender.position.x,
        y: this.sender.position.y,
    }
}

function MobCollisionEvent(direction) {
    MobEvent.call(this, "COLLISION");
    this.direction = direction;
}

function MobDiedEvent(mob) {
    MobEvent.call(this, "DIED");
    this.mob = mob;
}