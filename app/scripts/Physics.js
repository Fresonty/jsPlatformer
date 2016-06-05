function Physics() {
    this.applyGravity = function (y_vel) {
        if (y_vel <= 8) {
            return (y_vel + 0.4);
        }
        else return y_vel
    }
    this.getCollisions = function (caller, spritesGroup = container) {
        var collisions = [];
        for (sprite in spritesGroup.children) {
            if (spritesGroup.children[sprite] !== caller) {
                if (this.hitTestRectangle(caller, spritesGroup.children[sprite])) {
                    collisions.push(spritesGroup.children[sprite]);
                }
            }
        }
        return collisions;
    }
    this.hitTestRectangle = function(r1, r2) {
        //Define the variables we'll need to calculate
        var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

        //hit will determine whether there's a collision
        hit = false;

        //Find the center points of each sprite
        r1.centerX = r1.x + r1.width / 2;
        r1.centerY = r1.y + r1.height / 2;
        r2.centerX = r2.x + r2.width / 2;
        r2.centerY = r2.y + r2.height / 2;

        //Find the half-widths and half-heights of each sprite
        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;

        //Calculate the distance vector between the sprites
        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;

        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;

        //Check for a collision on the x axis
        if (Math.abs(vx) < combinedHalfWidths) {

            //A collision might be occuring. Check for a collision on the y axis
            if (Math.abs(vy) < combinedHalfHeights) {

                //There's definitely a collision happening
                hit = true;
            } else {

                //There's no collision on the y axis
                hit = false;
            }
        } else {

            //There's no collision on the x axis
            hit = false;
        }

        //`hit` will be either `true` or `false`
        return hit;
    };
    this.move_x = function (caller) {
        caller.position.x += caller.vel.x;
        var collisions = physics.getCollisions(caller, container)
        if (collisions.length > 0) {
            if (caller.vel.x > 0) {
                caller.vel.x = 0;
                caller.position.x = collisions[0].x - caller.width;
            }
            else if (caller.vel.x < 0) {
                caller.vel.x = 0;
                caller.position.x = collisions[0].x + collisions[0].width;
            }
        }
    }
    
    this.move_y = function (caller) {
        caller.position.y += caller.vel.y;
        var collisions = physics.getCollisions(caller, container)
        if (collisions.length > 0) {
            if (caller.vel.y > 0) {
                caller.vel.y = 0;
                caller.position.y = collisions[0].y - caller.height;
                caller.state = new PlayerStandingState(caller);
            }
            else if (caller.vel.y < 0) {
                caller.vel.y = 0;
                caller.position.y = collisions[0].y + collisions[0].height;
            }
        }
        else {
            caller.state = new PlayerJumpingState(caller);
        }
    }
}
physics = new Physics();