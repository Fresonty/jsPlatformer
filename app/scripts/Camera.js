function Camera(target) {
    this.target = target;
    this.position = this.target.position

    this.update = function() {
        this.position = this.target.position;
        world.position.x = - this.position.x * world.scale.x + document.getElementById("canvas").width / 2;
    }
}