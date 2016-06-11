function Component(caller) {
    this.caller = caller;
    this.makeEvents = function () { };
    this.handleEvents = function () {
        for (event in eventQueue) {
            this.handleEvent(eventQueue[event]);
        }
        for (event in this.caller.ownEventQueue) {
            this.handleEvent(this.caller.ownEventQueue[event]);
        }
    };
    this.handleEvent = function () { };
    this.update = function () { };
}

// Physics
function PhysicsComponent(caller) {
    Component.call(this, caller);

    this.update = function () {
        this.applyGravity();
        this.move();
    }

    this.handleEvent = function (event) {
        switch (event.type) {
            case "ATTACK":
                if (Math.abs(event.position.x - this.caller.x) < 300 && Math.abs(event.position.y - this.caller.y) < 300) {
                    if (event.sender !== this.caller) {
                        console.log("got attacked")
                    }
                }
                break;
        }
    }

    this.applyGravity = function () {
        if (this.caller.vel.y <= 8) {
            this.caller.vel.y += 0.4;
        }
    }

    this.move = function () {
        this.move_x();
        this.move_y();
    }

    this.move_x = function () {
        this.caller.position.x += this.caller.vel.x;
        var collisions = this.getCollisions(container)
        if (collisions.length > 0) {
            if (this.caller.vel.x > 0) {
                this.caller.position.x = collisions[0].x - this.caller.width / 2;
            }
            else if (this.caller.vel.x < 0) {
                this.caller.position.x = collisions[0].x + collisions[0].width;
            }
        }
    }

    this.move_y = function () {
        this.caller.position.y += this.caller.vel.y;
        var collisions = this.getCollisions(container)
        if (collisions.length > 0) {
            if (this.caller.vel.y > 0) {
                this.caller.vel.y = 0;
                this.caller.position.y = collisions[0].y - this.caller.height / 2;
                this.caller.ownEventQueue.push(new MobCollisionEvent("DOWN"));
            }
            else if (this.caller.vel.y < 0) {
                this.caller.vel.y = 0;
                this.caller.position.y = collisions[0].y + collisions[0].height;
            }
        }
    }

    this.getCollisions = function (spritesGroup = container) {
        var collisions = [];
        for (sprite in spritesGroup.children) {
            if (spritesGroup.children[sprite] !== caller) {
                if (this.hitTestRectangle(this.caller, spritesGroup.children[sprite])) {
                    collisions.push(spritesGroup.children[sprite]);
                }
            }
        }
        return collisions;
    }

    this.hitTestRectangle = function (r1, r2) {
        var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
        hit = false;

        r1.centerX = r1.x;
        r1.centerY = r1.y;
        r2.centerX = r2.x + r2.width / 2;
        r2.centerY = r2.y + r2.height / 2;

        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;

        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;

        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;

        if (Math.abs(vx) < combinedHalfWidths) {
            if (Math.abs(vy) < combinedHalfHeights) {
                hit = true;
            } else {
                hit = false;
            }
        } else {
            hit = false;
        }
        return hit;
    };
}

function StatePhysicsComponent(caller) {
    PhysicsComponent.call(this, caller);
    this.state = StandingState;

    this.move_y = function() {
        this.caller.position.y += this.caller.vel.y;
        var collisions = this.getCollisions(container)
        if (collisions.length > 0) {
            if (this.caller.vel.y > 0) {
                this.caller.vel.y = 0;
                this.caller.position.y = collisions[0].y - this.caller.height / 2;
                this.caller.ownEventQueue.push(new MobCollisionEvent("DOWN"));
                this.state = StandingState;
            }
            else if (this.caller.vel.y < 0) {
                this.caller.vel.y = 0;
                this.caller.position.y = collisions[0].y + collisions[0].height;
            }
        }
    }

    this.handleEvent = function (event) {
        this.state(event);
    }

    function StandingState(event) {
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
                        this.state = JumpingState;
                        break;
                }
                break;
        }
    }
    function JumpingState(event) {
        switch (event.type) {
            case "MOVE":
                switch (event.direction) {
                    case "RIGHT":
                        this.caller.vel.x = this.caller.speed;
                        break;
                    case "LEFT":
                        this.caller.vel.x = - this.caller.speed;
                        break;
                }
                break;
        }
    }
}
StatePhysicsComponent.prototype = Object.create(PhysicsComponent.prototype);

// Inputhandler
function InputhandlerComponent(caller, keys) {
    Component.call(this, caller);

    this.keys = keys;
    for (key in this.keys) {
        this.keys[key].press = function () { };
        this.keys[key].release = function () { };
    }
    this.makeEvents = function () {
        for (key in this.keys) {
            if (this.keys[key].isDown) {
                this.caller.ownEventQueue.push(this.keys[key].action);
            }
        }
    }
}

// Ai
function AiComponent(caller, type) {
    Component.call(this, caller);
}

function AgressiveAiComponent(caller, target) {
    AiComponent.call(this, caller);

    this.target = target;

    this.maxTargetDist = 600;
    this.holdDist = 200;

    this.makeEvents = function () {
        this.moveToTarget();
        // this.findPath();
        this.act();
    }

    this.findPath = function () {
        for (event in this.caller.ownEventQueue) {
            switch (this.caller.ownEventQueue[event].type) {
                case "MOVE":
                    switch (this.caller.ownEventQueue[event].direction) {
                        case "RIGHT":
                            this.caller.position.x += this.caller.vel.x;
                            var collisions = this.caller.components.physics.getCollisions(container)
                            this.caller.position.x -= this.caller.vel.x;
                            if (collisions.length > 0) {
                                this.caller.ownEventQueue.push(new MobMoveEvent("UP"));
                            }
                            break;
                        case "LEFT":
                            this.caller.position.x -= this.caller.vel.x;
                            var collisions = this.caller.components.physics.getCollisions(container)
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

// State
/*
function StateComponent(caller) {
    Component.call(this, caller)
}

function StandingStateComponent(caller) {
    StateComponent.call(this, caller);

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
                        this.caller.components.state = new JumpingStateComponent(this.caller);
                        break;
                }
                break;
        }
    }
}
StandingStateComponent.prototype = Object.create(StateComponent.prototype)

function JumpingStateComponent(caller) {
    StateComponent.call(this, caller);

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
                }
                break;
        }
    }
}
JumpingStateComponent.prototype = Object.create(StateComponent.prototype)
*/