import { setInterval } from 'timers/promises';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../interfaces/game.interface';
export enum PlayerStatus {
  Waiting = 0,
  Ready = 1,
  Playing = 2,
}

export interface Collidable{
	x: number;
	y: number;
	width: number;
	height: number;
}

export class PadItem {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  radi: number;

  constructor(x: number, y: number, width: number, height: number, color: string, radi: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.radi = radi;
  }

  isEqual(other: PadItem) {
    this.x = other.x;
    this.y = other.y;
    this.width = other.width;
    this.height = other.height;
    this.color = other.color;
    this.radi = other.radi;
  }
}

export class Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  v: number;
  r: number;
  temp: number;

	constructor() {
		this.x = 0;
		this.y = 0;
		this.dx = 0;
		this.dy = 0;
		this.v = 0;
		this.r = 0;
		this.temp = -1;
	}
	
	isEqual(other: Ball) {
		this.x = other.x;
		this.y = other.y;
		this.dx = other.dx;
		this.dy = other.dy;
		this.v = other.v;
		this.r = other.r;
		this.temp = other.temp;
	}

	init(x:number, y:number, dx:number,dy:number, v:number, r:number, temp:number){
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.v = v;
		this.r = r;
		this.temp = temp;
    }
}

export class Player1 {
	//paddleInfo
	paddle: PadItem;
  	//userInfo
	socketID: string;
	userID: number;
	nickname: string;
  	//event Info
	arrowDown: boolean;
	arrowUp: boolean;
	score: number;
	color: string;
	playerStatus: PlayerStatus;

  constructor(socketID?: string, userID?: number, nickname?: string) {
	this.paddle = new PadItem(0, 0, 0, 0, "#023904", 0);
    this.arrowDown = false;
    this.arrowUp = false;
    this.score = 0;
	this.color = '#000000';
	this.socketID = socketID;
	this.userID = userID;
	this.nickname = nickname;
	this.playerStatus = PlayerStatus.Waiting;
  }
}

export class Player2 {
	//paddleInfo
	paddle: PadItem;
  	//userInfo
	socketID: string;
	userID: number;
	nickname: string;
  	//event Info
	arrowDown: boolean;
	arrowUp: boolean;
	score: number;
	color: string;
	playerStatus: PlayerStatus;

  constructor(socketID?: string, userID?: number, nickname?: string) {
	this.paddle = new PadItem(0, 0, 0, 0, "#023904", 0);
    this.arrowDown = false;
    this.arrowUp = false;
    this.score = 0;
	this.color = '#000000';
	this.socketID = socketID;
	this.userID = userID;
	this.nickname = nickname;
	this.playerStatus = PlayerStatus.Waiting;
  }
}

export class Obstacle {
	//paddleInfo
	x: number;
	y: number;
	width: number;
	height: number;

	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	
	isEqual(other: Obstacle) {
		this.x = other.x;
		this.y = other.y;
		this.width = other.width;
		this.height = other.height;
	}
}




export class Game {
	player1: Player1;
	player2: Player2;
	ball: Ball;
	gameID: string;
	gameStatus: string;
	gameWinner: string;
	gameLoser: string;
	host: Player1;
	guest: Player2;
	obstacles : Obstacle[];
	readyNum: number;
	pad : PadItem[];
	board_x : number;
	board_y : number;
	intervalId : NodeJS.Timeout;
	constructor(player1 : Player1, player2 : Player2){
		this.ball = new Ball();
		this.player1 = player1;
		this.player2 = player2;
		this.host = player1;
		this.guest = player2;
		this.readyNum = 0;
		this.pad = [];
		this.obstacles = [];
	}

	bounce() {
		let ball : Ball = this.ball;
		if (ball.x + ball.r > this.board_x) {
		  ball.dx *= -1;
		  ball.x += ball.dx * ball.v;
		  // player1_win();
		} else if (ball.x - ball.r < 0) {
		  ball.temp = -1;
		  ball.dx *= -1;
		  ball.x += ball.dx * ball.v;
		  // player2_win();
		} else if (ball.y + ball.r > this.board_y|| ball.y - ball.r < 0) {
		  ball.dy *= -1;
		  ball.y += ball.dy * ball.v;
		  ball.temp = -1;
    	}
  	}

	move(){
	}

	pong() {
		let ball : Ball = this.ball;
		ball.x += ball.dx * ball.v;
		ball.y += ball.dy * ball.v;
		this.bounce();
		this.bounce_obstacle(this.obstacles);
		this.bounce_obstacle(this.pad);
	}

  	bounce_obstacle(obs_collidable : Collidable[]) {
    // console.log(obs.length);
	const obs = obs_collidable;
	let ball : Ball = this.ball;
    for (let i = 0; i < obs.length; i++) {
      if (ball.temp != i)
      {
        if (ball.x > obs[i].x && ball.x < obs[i].x + obs[i].width)
        {
          if (ball.y > obs[i].y - ball.r && ball.y < obs[i].y + obs[i].height + ball.r)
          {
            ball.dy *= -1;
            ball.y += ball.dy * ball.v;
            ball.temp = i;
          }
        }
        else if (ball.y > obs[i].y && ball.y < obs[i].y + obs[i].height)
        {
          if (ball.x > obs[i].x - ball.r && ball.x < obs[i].x + obs[i].width + ball.r)
          {
            ball.dx *= -1;
            ball.x += ball.dx * ball.v;
            ball.temp = i;
          }
        }
        else
        {
          if (Math.sqrt((ball.x - obs[i].x) * (ball.x - obs[i].x) + (ball.y - obs[i].y) * (ball.y - obs[i].y)) < ball.r)
          {
            ball.dx *= -1;
            ball.x += ball.dx * ball.v;
            ball.temp = i;
          }
          else if (Math.sqrt((ball.x - obs[i].x - obs[i].width) * (ball.x - obs[i].x - obs[i].width) + (ball.y - obs[i].y) * (ball.y - obs[i].y)) < ball.r)
          {
            ball.dx *= -1;
            ball.x += ball.dx * ball.v;
            ball.temp = i;
          }
          else if (Math.sqrt((ball.x - obs[i].x) * (ball.x - obs[i].x) + (ball.y - obs[i].y - obs[i].height) * (ball.y - obs[i].y - obs[i].height)) < ball.r)
          {
            ball.dx *= -1;
            ball.x += ball.dx * ball.v;
            ball.temp = i;
          }
          else if (Math.sqrt((ball.x - obs[i].x - obs[i].width) * (ball.x - obs[i].x - obs[i].width) + (ball.y - obs[i].y - obs[i].height) * (ball.y - obs[i].y) - obs[i].height) < ball.r)
          {
            ball.dx *= -1;
            ball.x += ball.dx * ball.v;
            ball.temp = i;
          }
        }
      }
	}
  }
}
