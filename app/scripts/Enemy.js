function Enemy(texturename) {
    Mob.call(this, texturename);
    this.state = new MobBaseState(this);
    
    this.move = function() {
        this.move_x();
        this.move_y();
    }
    
    this.ai = new AgressiveAi(this, player);
    
    this._update = function() {
        this.ai.update();
    }
    
    this.move_x = function () {
        this.position.x += this.vel.x;
        var collisions = physics.getCollisions(this, container)
        if (collisions.length > 0) {
            if (this.vel.x > 0) {
                this.position.x = collisions[0].x - this.width;
            }
            else if (this.vel.x < 0) {
                this.position.x = collisions[0].x + collisions[0].width;
            }
            this.jump();
        }
    }
    
    this.move_y = function () {
        this.position.y += this.vel.y;
        var collisions = physics.getCollisions(this, container)
        if (collisions.length > 0) {
            if (this.vel.y > 0) {
                this.vel.y = 0;
                this.position.y = collisions[0].y - this.height;
                this.state = new EnemyStandingState(this);
            }
            else if (this.vel.y < 0) {
                this.vel.y = 0;
                this.position.y = collisions[0].y + collisions[0].height;
            }
        }
        else {
            this.state = new EnemyJumpingState(this);
        }
    }
    
    this.jump = function() {
        this.vel.y = - 12;
        this.state = new PlayerJumpingState(this);
    } 
}
Enemy.prototype = Object.create(Mob.prototype)

function EnemyBaseState(caller) {
    MobBaseState.call(this, caller)
}
EnemyBaseState.prototype = Object.create(MobBaseState.prototype)

function EnemyStandingState(caller) {
    EnemyBaseState.call(this, caller)
    this.handleEvent = function(event) {
        switch (event) {
            case "MOVE_RIGHT":
                this.caller.vel.x = this.caller.speed;
                break;
            case "MOVE_LEFT":
                this.caller.vel.x = - this.caller.speed;
                break;
            case "MOVE_UP":
                this.caller.vel.y = - 12;
                this.caller.state = new EnemyJumpingState(this.caller);
        }
    }
}
EnemyStandingState.prototype = Object.create(EnemyBaseState.prototype)

function EnemyJumpingState(caller) {
    EnemyBaseState.call(this, caller)
}
EnemyJumpingState.prototype = Object.create(EnemyBaseState.prototype)


function Ai(caller) {
    this.caller = caller;
    this.update = function() {
        null;
    }
}

function AgressiveAi(caller, target) {
    Ai.call(this, caller);
    this.target = target;
    
    this.maxTargetDist = 1000;
    this.holdDist = 300;
    
    this.update = function() {
        this.moveToTarget();
    }
    
    this.moveToTarget = function() {
        if (Math.abs(this.caller.position.x - this.target.position.x) < this.maxTargetDist && Math.abs(this.caller.position.y - this.target.position.y) < this.maxTargetDist) {
            if (this.caller.position.x - this.target.position.x < - this.holdDist) {
                this.caller.ownEventQueue.push("MOVE_RIGHT");
            }
            else if (this.caller.position.x - this.target.position.x > this.holdDist) {
                this.caller.ownEventQueue.push("MOVE_LEFT");
            }
            else {
                this.caller.vel.x = 0;

            }
        }
    }
}