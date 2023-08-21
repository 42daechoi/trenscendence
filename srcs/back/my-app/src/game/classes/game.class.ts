//import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../interfaces/game.interface';

class PadItem {
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

  constructor(socketID?: string, userID?: number, nickname?: string) {
	this.paddle = new PadItem(0, 0, 0, 0, "#023904", 0);
    this.arrowDown = false;
    this.arrowUp = false;
    this.score = 0;
	this.color = '#000000';
	this.socketID = socketID;
	this.userID = userID;
	this.nickname = nickname;
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

  constructor(socketID?: string, userID?: number, nickname?: string) {
	this.paddle = new PadItem(0, 0, 0, 0, "#023904", 0);
    this.arrowDown = false;
    this.arrowUp = false;
    this.score = 0;
	this.color = '#000000';
	this.socketID = socketID;
	this.userID = userID;
	this.nickname = nickname;
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
	obastacles : Obstacle[];

	constructor(player1? : Player1, player2? : Player2){
		this.ball = new Ball();
		this.player1 = player1;
		this.player2 = player2;
		this.host = player1;
		this.guest = player2;
	}
}
