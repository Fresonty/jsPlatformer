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

    this.applyGravity = function () {
        if (this.caller.vel.y <= 2) {
            this.caller.vel.y += 0.1;
        }
    }

    this.move = function () {
        this.moveCollidex();
        this.moveCollidey();
    }

    this.moveCollidex = function () {
        this.caller.position.x += this.caller.vel.x;
        var collisions = this.getCollisions(container)
        if (collisions.length > 0) {
            if (this.caller.vel.x > 0) {
                this.caller.position.x = collisions[0].x - collisions[0].width / 2 - this.caller.width / 2;
                this.caller.ownEventQueue.push(new MobCollisionEvent("RIGHT"));
            }
            else if (this.caller.vel.x < 0) {
                this.caller.position.x = collisions[0].x + collisions[0].width / 2 + this.caller.width / 2;
                this.caller.ownEventQueue.push(new MobCollisionEvent("LEFT"));
            }
        }
    }

    this.moveCollidey = function () {
        this.caller.position.y += this.caller.vel.y;
        var collisions = this.getCollisions(container)
        if (collisions.length > 0) {
            if (this.caller.vel.y > 0) {
                this.caller.vel.y = 0;
                this.caller.position.y = collisions[0].y - collisions[0].height / 2 - this.caller.height / 2;
                this.caller.ownEventQueue.push(new MobCollisionEvent("DOWN"));
            }
            else if (this.caller.vel.y < 0) {
                this.caller.vel.y = 0;
                this.caller.position.y = collisions[0].y + collisions[0].height / 2 + this.caller.height / 2;
                this.caller.ownEventQueue.push(new MobCollisionEvent("UP"));
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

        r2.centerX = r2.x;
        r2.centerY = r2.y;

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

    this._update = this.update;
    this.update = function () {
        this._update();
        for (event in this.caller.ownEventQueue) {
            if (this.caller.ownEventQueue[event].type === "COLLISION") {
                if (this.caller.ownEventQueue[event].direction === "DOWN") {
                    this.state = StandingState;
                }
            }
        }
    }

    this.handleEvent = function (event) {
        this.state(event);
    }

    function StandingState(event) {
        switch (event.type) {
            case "ATTACK":
                if (Math.abs(event.position.x - this.caller.x) < 300 && Math.abs(event.position.y - this.caller.y) < 300) {
                    if (event.sender !== this.caller) {
                        //console.log("got attacked")
                    }
                }
                break;
            case "MOVE":
                switch (event.direction) {
                    case "RIGHT":
                        this.caller.vel.x = this.caller.speed;
                        break;
                    case "LEFT":
                        this.caller.vel.x = - this.caller.speed;
                        break;
                    case "UP":
                        this.caller.vel.y = - 3;
                        this.state = JumpingState;
                        break;
                }
                break;
        }
    }
    function JumpingState(event) {
        switch (event.type) {
            case "ATTACK":
                if (Math.abs(event.position.x - this.caller.x) < 50 && Math.abs(event.position.y - this.caller.y) < 50) {
                    if (event.sender !== this.caller) {
                        //console.log("got attacked")
                    }
                }
                break;
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

    this.maxTargetDist = 100;
    this.holdDist = 50;

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

// Graphics
function GraphicsComponent(caller) {
    Component.call(this, caller);

    this.update = function() {
        if (this.caller.vel.x < 0 && this.caller.scale.x > 0) {
            this.caller.scale.x *= -1;
            console.log(this.caller.position.x)
        }
        else if(this.caller.vel.x > 0 && this.caller.scale.x < 0) {
            this.caller.scale.x *= -1;
            console.log(this.caller.position.x)
        }
        //this.caller.position.x = oldX
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