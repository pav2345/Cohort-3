var Direction;
(function (Direction) {
    Direction["Up"] = "UP";
    Direction["Down"] = "Down";
    Direction["Left"] = "Left";
    Direction["Right"] = "Right";
})(Direction || (Direction = {}));
function doSomething(keyPressed) {
    // do something.
}
doSomething(Direction.Down);
