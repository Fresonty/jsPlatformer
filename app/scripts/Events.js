var eventQueue = [];
function addEvent(event) {
    eventQueue.push(event)
}
function removeEvent(eventIndex) {
    eventQueue.splice(evendIndex, 1)
}
function clearEventQueue() {
    eventQueue = [];
}


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