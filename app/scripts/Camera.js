Camera = {
    target : null,
    viewPort : "canvas",
    maxOffset : 3/4,

    setTarget : function(target) {
        if (this.target === null) {
            this.target = target;
        }
        else {
            console.log("Target is already set")
        }
    },

    update : function() {
        if (this.target.position.x * world.scale.x > - world.position.x + document.getElementById(this.viewPort).width * this.maxOffset) {
            world.position.x = - this.target.position.x * world.scale.x + document.getElementById(this.viewPort).width / 2 + document.getElementById(this.viewPort).width * (1 - this.maxOffset);
        }
        else if (this.target.position.x * world.scale.x < - world.position.x + document.getElementById(this.viewPort).width * (1 - this.maxOffset)) {
            world.position.x = - this.target.position.x * world.scale.x + document.getElementById(this.viewPort).width / 2 - document.getElementById(this.viewPort).width * (1 - this.maxOffset);
        }

        if (this.target.position.y * world.scale.y > - world.position.y + document.getElementById(this.viewPort).height * this.maxOffset) {
            world.position.y = - this.target.position.y * world.scale.y + document.getElementById(this.viewPort).height / 2 + document.getElementById(this.viewPort).height * (1 - this.maxOffset);
        }
        else if (this.target.position.y * world.scale.y < - world.position.y + document.getElementById(this.viewPort).height * (1 - this.maxOffset)) {
            world.position.y = - this.target.position.y * world.scale.y + document.getElementById(this.viewPort).height / 2 - document.getElementById(this.viewPort).height * (1 - this.maxOffset);
        }
        
    }
}