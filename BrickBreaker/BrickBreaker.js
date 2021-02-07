//Canvas Variables
let canvas = document.querySelector("#gameCanvas");
let ctx = canvas.getContext("2d");
//X and Y Position of Ball
let x = canvas.width/2;
let y = canvas.height-30;
//Amount X and Y is Incremented By
let dx = 2;
let dy = -2;
//Ball Radius
const ballRadius = 10;
//Paddle Variables
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth) / 2;
//Boolean Variables for Arrow Presses
let rightPressed = false;
let leftPressed = false;
//Brick Variables
let brickRow = 4;
let brickColumn = 6;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 58;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
//This variable creates an empty array
let bricks = [];

//Loops through empty array and creates an object based on the X and Y coordinates
for(let c = 0; c<brickColumn; c++) {
  bricks[c] = [];
  for(let r = 0; r<brickRow; r++) {
    bricks[c][r] = {x: 0, y: 0, status: 1};
  }
}

//Add Event Listeners for Keyup and Keydown
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//Function for Key Down Handler
function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

//Function for Key Up Handler
function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

//Function that Detects Collision and Updates Brick Status to 0
function collisionDetect() {
  for(var c=0; c<brickColumn; c++) {
    for(var r=0; r<brickRow; r++) {
      var b = bricks[c][r];
      if(b.status == 1) {
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status = 0;
        }
      }
    }
  }
}

//Function to Draw Ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

//Function to Draw Paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#red";
  ctx.fill();
  ctx.closePath();
}

//Function to Draw Bricks
function drawBricks() {
  for(let c = 0; c<brickColumn; c++) {
    for(let r = 0; r<brickRow; r++) {
      if(bricks[c][r].status == 1) {
        //Position on X and Y axis
        let brickX = (c*(brickWidth+brickPadding)) + brickOffsetLeft;
        let brickY = (r*(brickHeight+brickPadding)) + brickOffsetTop;
        bricks[c][r].x = 0;
        bricks[c][r].y = 0;
        //Actually Drawing the Bricks
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

//This function calls both drawBall and drawPaddle. Also clears canvas per interval.
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawBricks();
  collisionDetect();
}

//Function to Move Ball and Paddle
function move() {
  x += dx;
  y += dy;
  
  //Moves Ball
  if (x + dx < ballRadius || x + dx > canvas.width-ballRadius) {
    dx = -dx;
  }
  
  if (y + dy < ballRadius ) {
    dy = -dy;
  } else if (y + dy > canvas.height-ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        alert("GAME OVER! Try Again");
        document.location.reload();
        clearInterval(interval);
      }
  }
    
  //Moves Paddle
  if (rightPressed) {
    paddleX += 5;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 5;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
}

//Frames Per Second
let fps = 60;
//Calls Draw and Move Functions
let interval = setInterval(function() {
  draw();
  move();
}, 1000/fps);