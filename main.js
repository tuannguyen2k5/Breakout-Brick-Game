var canvas = document.getElementById("test");
var context = canvas.getContext("2d");

let ball = {
    x: 10,
    y: canvas.height / 2,
    dx: 0,
    dy: 0,
    radius: 10
};
let bar = {
    height: 10,
    width: 70,
    speed: 0,
    x: canvas.width / 2,
    y: canvas.height - 10,
    isMovingLeft: false,
    isMovingRight: false
};
let brick = {
    offSetX: 20,
    offSetY: 20,
    margin: 20,
    totalCol: 10,
    totalRow: 3,
    width: 42,
    height: 15
}
let bricks = [];
let start_game = document.getElementById("start-game");
let restart = document.getElementById("refresh");
let win = document.getElementById("win");
let isGameOver = false;
let score = 0;
/*audio*/
const lose = new Audio();
const collisionBrick = new Audio();
const collisionBar = new Audio();
/*audio src*/
lose.src = "lose.mp3";
collisionBrick.src = "collisionBrick.mp3";
collisionBar.src = "bar.mp3";
/*start game */
function start() {

    ball.dx = 4;
    ball.dy = 4;
    bar.speed = 10;
    start_game.style.display = 'none';
}


/**bar** */
//di chuyen thanh
document.addEventListener('keyup', (event) => {
    if (event.keyCode == 37) {
        bar.isMovingLeft = false;
    }
    else if (event.keyCode == 39) {
        bar.isMovingRight = false;
    }
});
document.addEventListener('keydown', (event) => {
    if (event.keyCode == 37) {
        bar.isMovingLeft = true;
    }
    else if (event.keyCode == 39) {
        bar.isMovingRight = true;
    }
});
//update toa do thanh
function updateBar() {
    if (bar.isMovingLeft == true) {
        bar.x -= bar.speed;
    } else if (bar.isMovingRight == true) {
        bar.x += bar.speed;
    }
}
//ve thanh
function drawBar() {
    context.beginPath();
    context.rect(bar.x, bar.y, bar.width, bar.height);
    context.fillStyle = "#ff0000";
    context.fill();
    context.closePath();
}
//gioi han thanh
function limitedBar() {
    if (bar.x < 0) bar.x = 0;
    else if (bar.x > canvas.width - bar.width) bar.x = canvas.width - bar.width;
}

/***ball ****/
//ve bong
function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
    context.fillStyle = "#ff0000";
    context.fill();
    context.closePath();
}
//xu ly bong va cham voi bien
function collisionBall() {
    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y < ball.radius) {
        ball.dy = -ball.dy;
    }
}
//update toa do bong
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}
/**collision ball and bar */
function collisionBallBar() {
    if (ball.x + ball.radius >= bar.x && ball.x - ball.radius <= bar.x + bar.width && ball.y + ball.radius >= bar.y) {
        ball.dy = -ball.dy;
        collisionBar.play();
    }
}
/**brick */
// set toa do cac vien gach
function brickPosition() {
    for (var i = 0; i < brick.totalCol; i++) {
        for (var j = 0; j < brick.totalRow; j++) {
            bricks.push({
                x: brick.offSetX + i * (brick.width + brick.margin),
                y: brick.offSetY + j * (brick.height + brick.margin),
                isBroken: false
            });
        }
    }
}
brickPosition();
//ve gach
function drawBricks() {
    bricks.forEach(function (b) {
        if (b.isBroken == false) {
            context.beginPath();
            context.rect(b.x, b.y, brick.width, brick.height);
            context.fill();
            context.closePath();
        }
    });
}
//xu ly va cham gach va bong
function collisionBrickBall() {
    bricks.forEach(function (b) {
        if (b.isBroken == false) {
            if (ball.x + ball.radius >= b.x && ball.x - ball.radius <= b.x + brick.width
                && ball.y + ball.radius >= b.y && ball.y - ball.radius <= b.y + brick.height
            ) {
                collisionBrick.play();
                ball.dy = -ball.dy;
                score++;
                b.isBroken = true;
            }
        }
    });
}
/*draw score*/
function drawScore() {
    context.beginPath();
    context.fillStyle = "#00ff00";
    context.font = "45px changa one";
    context.fillText("Score:" + score, 0, canvas.height);
    context.closePath();
}
/**game over */
function checkGameOver() {
    if (ball.y > canvas.height - ball.radius || score == 30) {
        isGameOver = true;
    }
}
function gameOver() {
    restart.style.display = "block";
    lose.play();
}
/*refresh*/
function refresh() {
    location.reload();
}
function draw() {
    if (isGameOver == false) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBar();
        drawBall();
        drawBricks();

        limitedBar();
        collisionBall();
        collisionBallBar();
        collisionBrickBall();
        updateBar();
        updateBall();
        requestAnimationFrame(draw);
        checkGameOver();
        drawScore();
    }
    else {
        gameOver();
    }
}
draw();