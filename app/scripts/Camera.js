Camera = {
    // Attributes for camera
    target: null,
    viewPort: "canvas",
    maxOffset: 3 / 4,

    setTarget: function (target) {
        this.target = target;
    },

    // Update 'camera position'
    update: function () {
        // X right
        if (this.target.position.x * Game.world.scale.x > - Game.world.position.x + document.getElementById(this.viewPort).width * this.maxOffset) {
            Game.world.position.x = - this.target.position.x * Game.world.scale.x + document.getElementById(this.viewPort).width / 2 + document.getElementById(this.viewPort).width * (1 - this.maxOffset);
        }
        // X left
        else if (this.target.position.x * Game.world.scale.x < - Game.world.position.x + document.getElementById(this.viewPort).width * (1 - this.maxOffset)) {
            Game.world.position.x = - this.target.position.x * Game.world.scale.x + document.getElementById(this.viewPort).width / 2 - document.getElementById(this.viewPort).width * (1 - this.maxOffset);
        }

        // Y bottom
        if (this.target.position.y * Game.world.scale.y > - Game.world.position.y + document.getElementById(this.viewPort).height * this.maxOffset) {
            Game.world.position.y = - this.target.position.y * Game.world.scale.y + document.getElementById(this.viewPort).height / 2 + document.getElementById(this.viewPort).height * (1 - this.maxOffset);
        }
        // Y top
        else if (this.target.position.y * Game.world.scale.y < - Game.world.position.y + document.getElementById(this.viewPort).height * (1 - this.maxOffset)) {
            Game.world.position.y = - this.target.position.y * Game.world.scale.y + document.getElementById(this.viewPort).height / 2 - document.getElementById(this.viewPort).height * (1 - this.maxOffset);
        }
    }
}