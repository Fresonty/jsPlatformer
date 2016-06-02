var eventQueue = [];
function addEvent(event) {
    eventQueue.push(event)
}

ListenEvents = function() {
    UP = keyboard(38);
    this.UP.press = function() {
        addEvent(event);
    }
}

