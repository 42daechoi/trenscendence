const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});
class game {
  constructor(pad, board_x, board_y, ball, obs){
    this.pad = pad;
    this.board_x = board_x;
    this.board_y = board_y;
    this.ball = ball;
    this.obs = obs;
  }
}

class ballItem {
  constructor(dx, dy){
    this.dx = 0;
    this.dy = 0;
  }
  init(dx, dy){
    this.dx = dx;
    this.dy = dy;
  }
}
class padItem {
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
}
const gameset = new game();
const ball = new ballItem;
let i = 0;
let j = 0;
let k = 2;
// 클라이언트와 연결이 수립되었을 때 처리
function updatedirection(ball) {
  ball.dy = 0.5 * Math.random() + 0.5;
  ball.dx = 1;
  ball.dx *= Math.random() < 0.5 ? -1 : 1;
  ball.dy *= Math.random() < 0.5 ? -1 : 1;
}
class client{
  constructor(id, pad){
    this.id = id;
    this.pad = pad;
    this.ready = false;
  }
}

const user = [];
io.on('connection', (socket) => {
  console.log('Client connected: ', socket.id);
  i++;
  console.log(i);
  socket.on('wait', () => {
    user.push(new client(socket.id, j));
    io.to(socket.id).emit("player", j);
    j++;
  });
  socket.on('Ready', data => { 
  const find = user.find(user => user.id === socket.id);
  find.ready = data;
  console.log("wait", user);
  for(let i = 0; i < 2; i++)
  {
    if (user[i].ready === false)
      break;
    if (i === 1)
      io.emit("Start", "");
      io.to(user[0].id).emit("client", 0);
      io.to(user[1].id).emit("client", 1);

  }
  });
  socket.on('gameset', (data) =>{
    gameset.ball = data.ball;
    gameset.board_x = data.board_x;
    gameset.board_y = data.board_y;
    gameset.obs = data.obs;
    gameset.pad = data.pad;
    io.emit('start', 1);
    updatedirection(ball);
    io.emit('ball', ball);
  });
  socket.on('pad1', (data) => {
    
    // console.log("pad1" ,data);
    io.emit('pad1', data);
  });
  socket.on('pad2', (data) => {
    // console.log("pad2" ,data);
    io.emit('pad2', data);
  });
  socket.on('disconnect', () => {
    i--;
    console.log('Client disconnected: ', socket.id);
    console.log(i);
    const find = user.findIndex(user => user.id === socket.id);
    user.splice(find, 1);
    j = 0;
  });
});


const port = 3001;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
