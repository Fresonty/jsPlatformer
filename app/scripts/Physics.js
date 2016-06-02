function Physics() {
    this.applyGravity = function(yvel) {
        if (yvel <= 5) {
            return yvel += 0.1;
        }
    }
}
physics = new Physics();