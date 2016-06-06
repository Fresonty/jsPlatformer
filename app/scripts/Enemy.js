function Enemy(texturename) {
    Mob.call(this, texturename);
    this.state = new MobBaseState(this);
    
    this.move = function() {
        this.move_x();
        this.move_y();
    }
    
    this.ai = new AgressiveAi(this, player);
    
    this._update = function() {
        this.ai.moveToTarget(this, player);
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
}
Enemy.prototype = Object.create(Mob.prototype)

function EnemyBaseState(caller) {
    MobBaseState.call(this, caller)
}
EnemyBaseState.prototype = Object.create(MobBaseState.prototype)

function EnemyStandingState(caller) {
    EnemyBaseState.call(this, caller)
}
EnemyStandingState.prototype = Object.create(EnemyBaseState.prototype)

function EnemyJumpingState(caller) {
    EnemyBaseState.call(this, caller)
}
EnemyJumpingState.prototype = Object.create(EnemyBaseState.prototype)


function Ai(caller) {
    this.caller = caller;
}

function AgressiveAi(caller, target) {
    Ai.call(this, caller);
    this.target = target;
    
    this.maxTargetDist = 500;
    
    this.moveToTarget = function() {
        if (Math.abs(this.caller.position.x - this.target.position.x) < this.maxTargetDist || Math.abs(this.caller.position.y - this.target.position.y) < this.maxTargetDist) {
            if (this.caller.position.x - this.target.position.x < 0) {
                this.caller.vel.x = this.caller.speed;
            }
            else  {
                this.caller.vel.x = - this.caller.speed;
            }
            /*if (this.caller.position.y - this.target.position.y < 0) {
                this.caller.vel.y = this.caller.speed;
            }
            else {
                this.caller.vel.y = - this.caller.speed;
            }*/
        }
    }
}