function Component(caller) {
    this.caller = caller;
    this.makeEvents = function () { };
    this.handleEvents = function () {
        for (event in Game.eventQueue) {
            this.handleEvent(Game.eventQueue[event]);
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
        this.moveCollideX();
        this.moveCollideY();
    }

    this.moveCollideX = function () {
        this.caller.position.x += this.caller.vel.x;
        var collisions = this.getCollision(Game.world, "x")
        //if (collisions.length > 0) {
        if (collisions !== null) {
            if (this.caller.vel.x > 0) {
                this.caller.vel.x = 0;
                this.caller.position.x = collisions.x - collisions.width / 2 - this.caller.width / 2;
                this.caller.ownEventQueue.push(new MobCollisionEvent("RIGHT"));
            }
            else if (this.caller.vel.x < 0) {
                this.caller.vel.x = 0;
                this.caller.position.x = collisions.x + collisions.width / 2 + this.caller.width / 2;
                this.caller.ownEventQueue.push(new MobCollisionEvent("LEFT"));
            }
        }
    }

    this.moveCollideY = function () {
        this.caller.position.y += this.caller.vel.y;
        var collisions = this.getCollision(Game.world, "y")
        //if (collisions.length > 0) {
        if (collisions !== null) {
            if (this.caller.vel.y > 0) {
                this.caller.vel.y = 0;
                this.caller.position.y = collisions.y - collisions.height / 2 - this.caller.height / 2;
                this.caller.ownEventQueue.push(new MobCollisionEvent("DOWN"));
            }
            else if (this.caller.vel.y < 0) {
                this.caller.vel.y = 0;
                this.caller.position.y = collisions.y + collisions.height / 2 + this.caller.height / 2;
                this.caller.ownEventQueue.push(new MobCollisionEvent("UP"));
            }
        }
    }

    this.getCollisions = function (spritesGroup = Game.world) {
        var collisions = [];
        for (sprite in spritesGroup.children) {
            if (Math.abs(spritesGroup.children[sprite].position.x - this.caller.position.x) < 30 && Math.abs(spritesGroup.children[sprite].position.y - this.caller.position.y) < 30) {
                if (spritesGroup.children[sprite] !== caller) {
                    if (this.hitTestRectangle(this.caller, spritesGroup.children[sprite])) {
                        collisions.push(spritesGroup.children[sprite]);
                    }
                }
            }
        }
        return collisions;
    }

    this.getCollision = function(spritesGroup, axis) {
        for (sprite in spritesGroup.children) {
            if (Math.abs(spritesGroup.children[sprite].position[axis] - this.caller.position[axis]) < 30) {
                if (spritesGroup.children[sprite] !== caller) {
                    if (this.hitTestRectangle(this.caller, spritesGroup.children[sprite])) {
                        return spritesGroup.children[sprite];
                    }
                }
            }
        }
        return null;
    }

    this.hitTestRectangle = function (r1, r2) {
        var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
        hit = false;

        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;

        vx = r1.x - r2.x;
        vy = r1.y - r2.y;

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
    this.state = null;

    this._update = this.update;
    this.update = function () {
        this._update();
        for (event in this.caller.ownEventQueue) {
            if (this.caller.ownEventQueue[event].type === "COLLISION") {
                if (this.caller.ownEventQueue[event].direction === "DOWN") {
                    this.state = this.States.Standing;
                }
            }
            else {
                this.state = this.States.Jumping;
            }
        }
    }

    this.handleEvent = function (event) {
        this.state(event);
    }
    this.States = {
        Standing: function (event) {
            switch (event.type) {
                case "ATTACK":
                    if (Math.abs(event.position.x - this.caller.x) < 300 && Math.abs(event.position.y - this.caller.y) < 300) {
                        if (event.sender !== this.caller) {
                            Game.addEvent(new MobDiedEvent(this.caller));
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
                            this.state = this.States.Jumping;
                            break;
                    }
                    break;
            }
        },
        Jumping: function (event) {
            switch (event.type) {
                case "ATTACK":
                    if (Math.abs(event.position.x - this.caller.x) < 50 && Math.abs(event.position.y - this.caller.y) < 50) {
                        if (event.sender !== this.caller) {
                            // see above, TODO: Combine
                            Game.addEvent(new MobDiedEvent(this.caller));
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
        },
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
            Game.addEvent(new MobAttackEvent(this.caller));
        }
    }
}

// Graphics
function GraphicsComponent(caller) {
    Component.call(this, caller);

    this.update = function () {
        if (this.caller.vel.x < 0 && this.caller.scale.x > 0) {
            this.caller.scale.x *= -1;
        }
        else if (this.caller.vel.x > 0 && this.caller.scale.x < 0) {
            this.caller.scale.x *= -1;
        }
    }
}