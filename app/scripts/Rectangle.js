function Rectangle(x, y, width, height, color) {
    PIXI.Graphics.call(this);
    this.color = color;
    this.beginFill(this.color);
    this.drawRect(0, 0, width, height);
    this.endFill();
    this.pivot.set(width / 2, height / 2);
}
Rectangle.prototype = Object.create(PIXI.Graphics.prototype)

function Button(x, y, width, height, color, dispText, action) {
    Rectangle.call(this, x, y, width, height, color);
    Game.GUI.addChild(this);
    Game.guiUpdateObjects.push(this);
    this.x = x;
    this.y = y;
    this.dispText = dispText;
    this.text = new PIXI.Text(this.dispText,{font : '16px Arial', fill : 0xFFFFFF});
    this.text.position.x = this.position.x - this.text.width / 2;
    this.text.position.y = this.position.y - this.text.height / 2;
    Game.GUI.addChild(this.text);

    this.action = action;
    this.checkHover = function () {
        var mouseX = getMouseX();
        var mouseY = getMouseY();
        if (mouseX <= this.position.x * GUISCALE + this.width / 2 * GUISCALE && mouseX >= this.position.x * GUISCALE - this.width / 2 * GUISCALE) {
            if (mouseY <= this.position.y * GUISCALE + this.height / 2 * GUISCALE && mouseY >= this.position.y * GUISCALE - this.height / 2 * GUISCALE) {
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