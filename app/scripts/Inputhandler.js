function Inputhandler(caller, keys) {
    this.caller = caller;
    this.keys = keys;
    for (key in this.keys) {
        this.keys[key].press = function() {};
        this.keys[key].release = function() {};
    }
    this.makeEvents = function() {
        for (key in this.keys) {
            if (this.keys[key].isDown) {
                this.caller.ownEventQueue.push(this.keys[key].action);
            }
        }
    }
}