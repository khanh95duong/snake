window.addEventListener("keydown", move, false);
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var snakeSize = 25;
var foodSize = 25;

// State of game, true until game is over
var game = true;
// Flag if a food has been eaten
var fed = false;
// Flag to only draw food once per eating
var foodDrawn = false;
// Is the game over
var over = false;

// Snake Location
var x = 0;
var y = -25;

// Screen dimensions
var swidth = canvas.width;
var sheight = canvas.height;
var foodX = Math.floor(Math.random() * swidth);
var foodY = Math.floor(Math.random() * sheight);

// Direction variable
// up = 1, right = 2, down = 3, left = 4
var direction;

var bodies = [];

function constructor(body, xx, yy) {
    body.px = xx;
    body.py = yy;
}

function newparent(body, parent) {
    body.px = parent.bx;
    body.py = parent.by;
}

function np(body) {
    body.px = x;
    body.py = y;
}

function shift(body) {
    body.bx = body.px;
    body.by = body.py;
}

function drawBody(body) {
    ctx.beginPath();
    ctx.fillStyle = "#00FF00";
    ctx.rect(body.bx, body.by, snakeSize, snakeSize);
    ctx.fill();
    ctx.stroke();
}


function move(e) {
    switch (e.keyCode) {
        case 37:
            // left key pressed
            if (direction != 2) direction = 4;
            break;
        case 38:
            // up key pressed
            if (direction != 3) direction = 1;
            break;
        case 39:
            // right key pressed
            if (direction != 4) direction = 2;
            break;
        case 40:
            // down key pressed
            if (direction != 1) direction = 3;
            break;
        case 81:
            fed = true;
            break;
    }
}

function drawHead() {	
    ctx.beginPath();
    ctx.fillStyle = "#FF0000";
    ctx.rect(x, y, snakeSize, snakeSize);
    ctx.fill();
    ctx.stroke();
}

function drawFoods() {
	var remainderX = foodX % 25;
	var remainderY = foodY % 25;
	if (remainderX <= 12) {
		foodX -= remainderX;
	}
	else if (remainderX > 12) {
		remainderX = 25 - remainderX;
		foodX += remainderX;
	}
	if (remainderY <= 12) {
		foodY -= remainderY;
	}
	else if (remainderY > 12) {
		remainder = 25 - remainderY;
		foodY += remainderY;
	}
	ctx.beginPath();
    ctx.fillStyle = "#FF8C00";
    ctx.rect(foodX, foodY, foodSize, foodSize);
    ctx.fill();
    ctx.stroke();
}

function draw() {
    ctx.clearRect(0, 0, 600, 600);
    // Drawing Snake
    drawHead();
    if (bodies[0] != null) {
        shift(bodies[0]);
        np(bodies[0]);
        drawBody(bodies[0]);
        for (i = 1; i < bodies.length; i++) {
            shift(bodies[i])
            newparent(bodies[i], bodies[i - 1]);
            drawBody(bodies[i]);
        }
    }
	if (fed === false) {
		drawFoods();
	}
}

// This will handle the out of bounds stuff
function youLose() {
	if (!over) {
		alert("out");
		over = true;
	}
	
}

function update() {
	
    if (fed) {
		foodX = Math.floor(Math.random() * swidth);
		foodY = Math.floor(Math.random() * sheight);
        fed = false;
        for (i = 0; i < 5; i++) {
            var newBody = {
                bx: -100,
                by: -100,
                px: -100,
                py: -100
            }
            bodies[bodies.length] = newBody;
        }
    }
    switch (direction) {
        case 1:
			if (y === 0) youLose();
            y -= 25;
            break;
        case 2:
            x += 25;
			if (x === swidth) youLose();
            break;
        case 3:
            y += 25;
			if (y === sheight) youLose();
            break;
        case 4:
			if (x === 0) youLose();
            x -= 25;
            break;
    }
    draw();
}

function init() {
    if (direction == null) {
        direction = 3;
        setInterval("update()", 100);
        var newBody = {
            bx: -100,
            by: -100,
            px: -100,
            py: -100
        }
        bodies[0] = newBody;
    }
}