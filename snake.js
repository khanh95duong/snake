window.addEventListener("keydown", move, false);
var canvas = document.getElementById("myCanvas");
var img1 = document.getElementById("gameWon");
var img2 = document.getElementById("gameLost");
var ctx = canvas.getContext("2d");
var snakeSize = 25;
var foodSize = 25;

// State of game, true until game is over
var game = true;
// Flag if a food has been eaten
var fed = false;
// Is the game over
var over = false;
var loss = false;
var fadeOnce = false;
var alreadyMove = false;

// Snake variables
var x = 0;
var y = -25;
var score = 0;
var bonus = 30000;
var second = 0;
var eaten = 0;
// Score counter
var start;
var elapsed;

// Screen dimensions
var swidth = canvas.width;
var sheight = canvas.height;
// Calculate what the x,y position of the food will be
var foodX = Math.floor(Math.random() * swidth);
var foodY = Math.floor(Math.random() * sheight);

// Direction variable
// up = 1, right = 2, down = 3, left = 4
var direction;

var bodies = [];

// A snake has a body and x and y coordinate
function constructor(body, xx, yy) {
    body.px = xx;
    body.py = yy;
}

// New parent for the body parts
function newparent(body, parent) {
    body.px = parent.bx;
    body.py = parent.by;
}

// New parent, but for the first body part
function np(body) {
    body.px = x;
    body.py = y;
}

// Update the moves
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
            if (direction != 2 && !alreadyMove) {
				direction = 4;
				alreadyMove = true;
			}
            break;
        case 38:
            // up key pressed
            if (direction != 3 && !alreadyMove) {
				direction = 1;
				alreadyMove = true;
			}
            break;
        case 39:
            // right key pressed
            if (direction != 4 && !alreadyMove) {
				direction = 2;
				alreadyMove = true;
			}
            break;
        case 40:
            // down key pressed
            if (direction != 1 && !alreadyMove) {
				direction = 3;
				alreadyMove = true;
			}
            break;
    }
}

// Draws the head, it is red
function drawHead() {	
    ctx.beginPath();
    ctx.fillStyle = "#FF0000";
    ctx.rect(x, y, snakeSize, snakeSize);
    ctx.fill();
    ctx.stroke();
}

// Don't spawn a food on the snake
function checkFood() {
	for (j = 0; j < bodies.length; j++) {
		if (foodX === bodies[j].bx && foodY === bodies[j].by) {
			return true;
		}
	}
	return false;
}

// Calculate where the next food will be
function calcFood() {
	
	if (foodX < 0) {
		foodX *= -1;
	}
	if (foodY < 0) {
		foodY *= -1;
	}
	if (foodX + 25 > swidth) {
		foodX = swidth - 25;
	}
	if (foodY + 25 > sheight) {
		foodY = sheight - 25;
	}
	
	var remainderX = foodX % 25;
	var remainderY = foodY % 25;
	
	foodX -= remainderX;
	foodY -= remainderY;
	
	while (checkFood()) {
		foodX = (foodX + 25) % swidth;
		foodY = (foodY + 25) % sheight;
	}
	
}

// Draws a food
function drawFood() {
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
	// Checks if the snake ate a food
	if (fed === false) {
		drawFood();
	}
	// Continuously update the score and Time bonus
	$("#scoreTracker").text("Score: " + score);
	$("#bonusTracker").text("Time Bonus: " + bonus);
}

// This will reload the webpage
function reLoad() {
	location.reload();
}

// This will handle the out of bounds stuff
function youLose() {
	elapsed = new Date() - start;
	if (!over) {	
		over = true;
		loss = true;
	}
}

// This will fade the picture in
function unfade(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
	
	$("#myCanvas").hide();
	highscore(score + bonus);
}

function win() {
	unfade(img1);
}

function update() {
	// If the game is not over nor haven't lost
	if (!over && !loss) {
		alreadyMove = false;
		// The Eat
		if (bodies[0].px === foodX && bodies[0].py === foodY) {
			foodX = Math.floor(Math.random() * swidth);
			foodY = Math.floor(Math.random() * sheight);
			calcFood();
			drawFood();
			score += 100000;
			eaten += 1;
			if (eaten === 20) {
				over = true;
				win();
			}
			fed = true;
		}
		// If the snake ate a thingy
		if (fed) {
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
		// Directions
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
		for (j = 1; j < bodies.length; j++) {
			if (x === bodies[j].bx && y === bodies[j].by) {
				youLose();
			}
		}
		second++;
		if (second === 6) {
			second = 0;
			bonus -= 10;
			if (bonus < 0) {
				bonus = 0;
			}
		}
	}
	// When you lose the game
	else if (loss){
		if (!fadeOnce) {
			fadeOnce = true;
			unfade(img2);
		}
	}

}

// Init the canvas on button press
function init() {
	start = new Date();
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
		calcFood();
    }
}

// This is commented so that you can test it.  If you uncomment it,
// You should be able to test if the scores update correctly.

//window.onload = update_scores();