window.addEventListener("keydown", move, false);
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var snakeSize = 25;

// State of game, true until game is over
var game = true;

// Snake Location
var x = 0;
var y = -25;

// Screen dimensions
var swidth = canvas.width;
var sheight = canvas.height;

// Direction variable
// up = 1, right = 2, down = 3, left = 4
var direction;

function move(e) {
    switch (e.keyCode) {
        case 37:
            // left key pressed
            direction = 4;
            break;
        case 38:
            // up key pressed
            direction = 1;
            break;
        case 39:
            // right key pressed
            direction = 2;
            break;
        case 40:
            // down key pressed
            direction = 3;
            break;
        case 32:
            update();
            break;
    }
}

function drawBody() {
    ctx.beginPath();
    ctx.fillStyle = "#00FF00";
    ctx.rect(x, y, snakeSize, snakeSize);
    ctx.fill();
}

function drawHead() {
    ctx.beginPath();
    ctx.fillStyle = "#FF0000";
    ctx.rect(x, y, snakeSize, snakeSize);
    ctx.fill();
}

function draw() {
    ctx.clearRect(0, 0, 600, 600);

    // Drawing Snake
    drawHead();
}

function update() {
    switch (direction) {
        case 1:
            y -= 25;
            break;
        case 2:
            x += 25;
            break;
        case 3:
            y += 25;
            break;
        case 4:
            x -= 25;
            break;
    }
    draw();
}

function init() {
    if (direction == null) {
        direction = 3;
        setInterval("update()", 100);
    }
}