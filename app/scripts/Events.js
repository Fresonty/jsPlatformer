var eventQueue = [];
function addEvent(event) {
    eventQueue.push(event)
}
function clearEventQueue() {
    eventQueue = [];
}

var UP = keyboard(38);
UP.press = function () {
    addEvent(event);
}