function	player1_win()
{
	let score_1 = document.getElementById("score_1");
	let score = score_1.innerText;
	score = parseInt(score) + 1;
	score_1.innerText = score;
}
function	player2_win()
{
	let score_2 = document.getElementById("score_2");
	let score = score_2.innerText;
	score = parseInt(score) + 1;
	score_2.innerText = score;
}


const canvas = document.getElementById("ball");
const ctx = canvas.getContext("2d");

pong = document.querySelector(".gameset"); 
obstacles = document.querySelector(".obstacle");

let obj = obstacles.firstElementChild;


class obstacleItem  
{
	constructor(x, y, width, height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height
	}
}

let obstacle = [];

while (obj != null)
{
	obstacle.push(new obstacleItem(obj.offsetLeft, obj.offsetTop, obj.clientWidth, obj.clientHeight));
	obj = obj.nextElementSibling;
}

var board_x = pong.clientWidth;
var board_y = pong.clientHeight; 

canvas.width = board_x;
canvas.height = board_y;


let x = board_x/2;
let y = board_y/2;
let dx = 4;
let dy = 4;
dx = dx / Math.sqrt(dx * dx + dy * dy);
dy = dy / Math.sqrt(dx * dx + dy * dy);

let v = 10;
let r = 20;


let a = 0.5;
let move_px = 20;
document.addEventListener('keydown', (e) => {
	if (e.key == 'Enter') {
		player1_win();
	}
	if (e.key == 'ArrowUp') {
		a = Math.exp(Math.log(a) + 1);
		obstacle[1].y -= move_px + a;
		if (obstacle[1].y < 0)
			obstacle[1].y = 0
	}
	if (e.key== 'ArrowDown')
	{
		a = Math.exp(Math.log(a) + 1);
		obstacle[1].y += move_px + a;
		if (obstacle[1].y > board_y - obstacle[1].height)
			obstacle[1].y = board_y - obstacle[1].height;
	}
	if (e.key == 'w') {
		a = Math.exp(Math.log(a) + 1);
		obstacle[0].y -= move_px+ a;
		if (obstacle[0].y < 0)
			obstacle[0].y = 0;
	}
	if (e.key == 's')
	{
		a = Math.exp(Math.log(a) + 1);
		obstacle[0].y += move_px + a;
		if (obstacle[0].y > board_y - obstacle[0].height)
			obstacle[0].y = board_y - obstacle[0].height;
	}
});
document.addEventListener('keyup', (e) => {
	if (e.key == 'ArrowUp') {
		a = 0.5;
		console.log(a);
	}
	if (e.key== 'ArrowDown')
	{
		a = 0.5;
	}
	if (e.key == 'w') {
		a = 0.5;
	}
	if (e.key == 's')
	{
		a = 0.5;
	}
});



function bounce()
{
	if (x + r > board_x || x - r <  0)
	{
		dx *= -1;
		x += dx*v;
	}
	else if (y + r > board_y || y - r < 0)
	{
		dy *= -1;
		y += dy*v;
	}
	bounce_obstacle();
	
}
function draw()
{
		x += dx*v;
		y += dy*v;
		bounce();
		ctx.beginPath();
		ctx.arc(x, y, r, 0,Math.PI * 2);
		ctx.stroke();
		ctx.fillStyle = "#ffffff";
		ctx.fill();
		ctx.closePath();
		for (i = 0; i < obstacle.length; i++)
		{
			ctx.beginPath();
			ctx.fillStyle = "#5a1515";
			ctx.fillRect(obstacle[i].x, obstacle[i].y, obstacle[i].width, obstacle[i].height);
			ctx.closePath();
		}
}

function bounce_obstacle()
{
	for (i = 0; i < obstacle.length; i++)
	{
		ctx.beginPath();
		ctx.fillStyle = "#5a1515";
        ctx.fillRect(obstacle[i].x, obstacle[i].y, obstacle[i].width, obstacle[i].height);
		ctx.closePath();
		prevPos_x = x - dx*v;
		prevPos_y = y - dy*v;
		grad_x = (prevPos_x - x) / (prevPos_y - y);
		grad_y = 1 / grad_x;
		obs_x = obstacle[i].x - r;
		obs_y = obstacle[i].y - r;
		if (dx < 0)
			obs_x += obstacle[i].width + 2 * r; 
		if (dy < 0)
			obs_y += obstacle[i].height + 2 * r;
		if ((x - obs_x) * (prevPos_x - obs_x) < 0)
		{
			if (dx < 0)
				crash_y = grad_x * (obs_x - r - x) + y;
			else
				crash_y = grad_x * (obs_x + r - x) + y;
			if (crash_y > obstacle[i].y &&  crash_y < obstacle[i].y + obstacle[i].height)
			{
				dx *= -1;
				x += dx*v;
			}
		}
		if ((y - obs_y) * (prevPos_y - obs_y) < 0)
		{
			if (dx < 0)
				crash_x = grad_y * (obs_y - r - y) + x;
			else
				crash_x = grad_y * (obs_y + r - y) + x;
			if (crash_x > obstacle[i].x &&  crash_x < obstacle[i].x + obstacle[i].width)
			{
				dy *= -1;
				y += dy*v;
			}
		}
	}
}

const animate = () => {

		ctx.clearRect(0,0,board_x, board_y);
		draw();
		window.requestAnimationFrame(animate);

}


window.requestAnimationFrame(animate);



