function Enemy(texturename) {
    Mob.call(this, texturename);
    this.state = new MobJumpingState(this);

    this.ai = new AgressiveAi(this, player);

    this._makeEvents = this.makeEvents;
    this.makeEvents = function () {
        this._makeEvents();
        this.ai.makeEvents();
    }
    this._handleEvents = this.handleEvents;
    this.handleEvents = function() {
        this._handleEvents();
    }
}
Enemy.prototype = Object.create(Mob.prototype)

function Ai(caller) {
    this.caller = caller;
    this.makeEvents = function () {
        null;
    }
}

function AgressiveAi(caller, target) {
    Ai.call(this, caller);
    this.target = target;

    this.maxTargetDist = 500;
    this.holdDist = 200;

    this.makeEvents = function () {
        this.moveToTarget();
        this.findPath();
        this.act();
    }

    this.findPath = function () {
        for (event in this.caller.ownEventQueue) {
            switch (this.caller.ownEventQueue[event].type) {
                case "MOVE":
                    switch (this.caller.ownEventQueue[event].direction) {
                        case "RIGHT":
                            this.caller.position.x += this.caller.vel.x;
                            var collisions = physics.getCollisions(this.caller, container)
                            this.caller.position.x -= this.caller.vel.x;
                            if (collisions.length > 0) {
                                this.caller.ownEventQueue.push(new MobMoveEvent("UP"));
                            }
                            break;
                        case "LEFT":
                            this.caller.position.x -= this.caller.vel.x;
                            var collisions = physics.getCollisions(this.caller, container)
                            this.caller.position.x += this.caller.vel.x;
                            if (collisions.length > 0) {
                                this.caller.ownEventQueue.push(new MobMoveEvent("UP"));
                            }
                            break;
                    }
                    break;
            }
        }
    }

    this.moveToTarget = function () {
        if (Math.abs(this.caller.position.x - this.target.position.x) < this.maxTargetDist && Math.abs(this.caller.position.y - this.target.position.y) < this.maxTargetDist) {
            if (this.caller.position.x - this.target.position.x < - this.holdDist) {
                this.caller.ownEventQueue.push(new MobMoveEvent("RIGHT"));
            }
            else if (this.caller.position.x - this.target.position.x > this.holdDist) {
                this.caller.ownEventQueue.push(new MobMoveEvent("LEFT"));
            }
        }
    }

    this.act = function () {
        if (Math.abs(this.caller.position.x - this.target.position.x) <= this.holdDist && Math.abs(this.caller.position.y - this.target.position.y) <= this.holdDist) {
            addEvent(new MobAttackEvent(this.caller));
        }
    }
}