var eventQueue = [];
function addEvent(event) {
    eventQueue.push(event)
}
function clearEventQueue() {
    eventQueue = [];
}

var Up = keyboard(PLAYER_MOVE_UP);
Up.press = function () {
    addEvent(event);
}
Up.release = function () {
    addEvent(event);
}
var Down = keyboard(PLAYER_MOVE_DOWN);
Down.press = function () {
    addEvent(event);
}
Down.release = function () {
    addEvent(event);
}
var Left = keyboard(PLAYER_MOVE_LEFT);
Left.press = function () {
    addEvent(event);
}
Left.release = function () {
    addEvent(event);
}
var Right = keyboard(PLAYER_MOVE_RIGHT);
Right.press = function () {
    addEvent(event);
}
Right.release = function () {
    addEvent(event);
}