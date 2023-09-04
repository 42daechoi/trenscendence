
function bounce_obstacle(obs) {
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
function bounce() {
  if (ball.x + ball.r > board_x) {
    // ball.x = board_x / 2;
    // ball.y = board_y / 2;
    // updatedirection(ball);
    ball.dx *= -1;
    ball.x += ball.dx * ball.v;

    // player1_win();
  } else if (ball.x - ball.r < 0) {
    // ball.x = board_x / 2;
    // ball.y = board_y / 2;
    // updatedirection(ball);
    ball.temp = -1;
    ball.dx *= -1;
    ball.x += ball.dx * ball.v;
    // player2_win();
  } else if (ball.y + ball.r > board_y || ball.y - ball.r < 0) {
    ball.dy *= -1;
    ball.y += ball.dy * ball.v;
    ball.temp = -1;
  }
}
function pong() {
  ball.x += ball.dx * ball.v;
  ball.y += ball.dy * ball.v;
  bounce();
  bounce_obstacle(obstacle);
  bounce_obstacle(pad);
}

class game {
  pad : padItem[];
  board_x :number;
  board_y:number;
  ball :ballItem;
  obs :htmlItem[];
  constructor(pad : padItem[], board_x :number, board_y:number, ball :ballItem, obs :htmlItem[]){
    this.pad = pad;
    this.board_x = board_x;
    this.board_y = board_y;
    this.ball = ball;
    this.obs = obs;
  }
} //gameset;
class htmlItem {
  x :number;
  y :number;
  width :number;
  height :number;
  constructor(x :number, y :number, width :number, height :number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  isEqual(other : htmlItem) {
    this.x = other.x;
    this.y = other.y;
    this.width = other.width;
    this.height = other.height;
  }
} //장애물
class ballItem {
  x :number;
  y :number;
  dx :number;
  dy :number;
  v :number;
  z :number;
  r :number;
  temp :number;
  constructor(){
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.v = 0;
    this.r = 0;
    this.temp = -1;
  }
  isEqual(other){
    this.x = other.x;
    this.y = other.y;
    this.dx = other.dx;
    this.dy = other.dy;
    this.v = other.v;
    this.r = other.r;
    this.temp = other.temp;
  }
  init(x, y, dx ,dy, v,r,temp){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.v = v;
    this.r = r;
    this.temp = temp;
  }
}//공
class padItem {
  x :number;
  y :number;
  width :number;
  height :number;
  color :number;
  radi :number;
  constructor(x, y, width, height, color, radi) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.radi = parseInt(radi);
  }
  isEqual(other) {
    this.x = other.x;
    this.y = other.y;
    this.width = other.width;
    this.height = other.height;
    this.color = other.color;
    this.radi = other.radi;
  }
}//paddle
const ball = new ballItem;
let pad : padItem[] = [];
let obstacle :htmlItem[] = [];
let board_x :number;
let board_y :number;

let i :number = 0;
let j :number = 0;
// 클라이언트와 연결이 수립되었을 때 처리
function updatedirection(ball : ballItem) {
  ball.dy = 0.5 * Math.random() + 0.5;
  ball.dx = 1;
  ball.dx *= Math.random() < 0.5 ? -1 : 1;
  ball.dy *= Math.random() < 0.5 ? -1 : 1;
}


    console.log(data);
    ball.isEqual(data.ball);
    board_x = data.board_x;
    board_y = data.board_y;
    for(let i = 0 ; i < 2; i++)
    {
        pad.push(new padItem(0,0,0,0,0,0));
        pad[i].isEqual(data.pad[i]);
    }
    for(let i :number = 0 ; i <  obs.length; i++)
    {
        pad.push(new htmlItem(0,0,0,0,0,0));
        pad[i].isEqual(data.obs[i]);
    }
    updatedirection(ball);
    console.log(pad);
    console.log(obstacle);
    console.log(ball);

    // io.emit('ball', ball);
    
    const interval = setInterval(() => {
      pong();
      // io.emit('draw', ball);
    }, 20);

  // socket.on('pad1', (data) => {
  //   pad[0].isEqual(data);
  //   io.emit('pad1', data);
  // });
  // socket.on('pad2', (data) => {
  //   pad[1].isEqual(data);
  //   io.emit('pad2', data);
  // });
