function Physics() {
    this.applyGravity = function(y_vel) {
        if (y_vel <= 1) {
            return (y_vel + 0.1);
        }
        else return y_vel
    }
}
physics = new Physics();