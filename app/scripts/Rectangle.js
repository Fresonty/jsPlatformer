function Rectangle(x, y, width, height, color) {
    PIXI.Graphics.call(this);
    this.color = color;
    this.beginFill(this.color);
    this.drawRect(0, 0, width, height);
    this.endFill();
    this.pivot.set(width / 2, height / 2);
    this.x = x;
    this.y = y;
}
Rectangle.prototype = Object.create(PIXI.Graphics.prototype)

function Button(x, y, width, height, color, action) {
    Rectangle.call(this, x, y, width, height, color);
    Game.GUI.addChild(this);
    this.action = action;
    this.checkHover = function () {
        var mouseX = getMouseX();
        var mouseY = getMouseY();
        if (mouseX <= this.position.x * Game.GUI.scale.x + this.width / 2 * Game.GUI.scale.x && mouseX >= this.position.x * Game.GUI.scale.x - this.width / 2 * Game.GUI.scale.x) {
            if (mouseY <= this.position.y * Game.GUI.scale.y + this.height / 2 * Game.GUI.scale.y && mouseY >= this.position.y * Game.GUI.scale.y - this.height / 2 * Game.GUI.scale.y) {
                return true;
            }
        }
    }
    this.checkClick = function () {
        if (this.checkHover()) {
            this.tint = this.color - 0x222222;
            if (getMouseClicking()) {
                return true;
            }
        }
        else {
            this.tint = this.color;
        }
    }
    this.update = function () {
        if (this.checkClick()) {
            this.action();
        }
    }
}
Button.prototype = Object.create(Rectangle.prototype)