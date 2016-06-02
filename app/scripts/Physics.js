function Physics() {
    this.applyGravity = function(yvel) {
        if (yvel <= 10) {
            return yvel += 1;
        }
    }
}
physics = new Physics();