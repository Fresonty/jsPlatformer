function Enemy(texturename) {
    Mob.call(this, texturename);
    this.state = new MobBaseState(this);

    this.move = function () {
        this.move_x();
        this.move_y();
    }

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

    this.move_x = function () {
        this.position.x += this.vel.x;
        var collisions = physics.getCollisions(this, container)
        if (collisions.length > 0) {
            if (this.vel.x > 0) {
                this.position.x = collisions[0].x - this.width / 2;
            }
            else if (this.vel.x < 0) {
                this.position.x = collisions[0].x + collisions[0].x + this.width / 2;;
            }
        }
    }

    this.move_y = function () {
        this.position.y += this.vel.y;
        var collisions = physics.getCollisions(this, container)
        if (collisions.length > 0) {
            if (this.vel.y > 0) {
                this.vel.y = 0;
                this.position.y = collisions[0].y - this.height / 2;
                this.state = new EnemyStandingState(this);
            }
            else if (this.vel.y < 0) {
                this.vel.y = 0;
                this.position.y = collisions[0].y + collisions[0].height + this.height / 2;
            }
        }
        else {
            this.state = new EnemyJumpingState(this);
        }
    }
}
Enemy.prototype = Object.create(Mob.prototype)

function EnemyBaseState(caller) {
    MobBaseState.call(this, caller)
}
EnemyBaseState.prototype = Object.create(MobBaseState.prototype)

function EnemyStandingState(caller) {
    EnemyBaseState.call(this, caller)
    this.handleEvent = function (event) {
        switch (event.type) {
            case "MOVE":
                switch (event.direction) {
                    case "RIGHT":
                        this.caller.vel.x = this.caller.speed;
                        break;
                    case "LEFT":
                        this.caller.vel.x = - this.caller.speed;
                        break;
                    case "UP":
                        this.caller.vel.y = - 12;
                        this.caller.state = new EnemyJumpingState(this.caller);
                        break;
                }
                break;
            case "ATTACK":
                if (Math.abs(event.position.x - this.caller.x) < 200 && Math.abs(event.position.y - this.caller.y) < 200) {
                    console.log("Valid attack")
                    if (event.sender !== this.caller) {
                        this.caller.position.y = 10000;
                    }
                }
                break;
        }
    }
}
EnemyStandingState.prototype = Object.create(EnemyBaseState.prototype)

function EnemyJumpingState(caller) {
    EnemyStandingState.call(this, caller)
}
EnemyJumpingState.prototype = Object.create(EnemyStandingState.prototype)


function Ai(caller) {
    this.caller = caller;
    this.makeEvents = function () {
        null;
    }
}

function AgressiveAi(caller, target) {
    Ai.call(this, caller);
    this.target = target;

    this.maxTargetDist = 1000;
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