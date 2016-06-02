var eventQueue = [];
function addEvent(event) {
    eventQueue.push(event)
}

var UP = keyboard(38);
UP.press = function () {
    addEvent(event);
}