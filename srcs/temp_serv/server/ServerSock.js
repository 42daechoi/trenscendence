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
const ball = new ballItem;
let i = 0;
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
    this.pad = 0;
  }
}
const user = [];
io.on('connection', (socket) => {
  console.log('Client connected: ', socket.id);
  io.to(socket.id).emit('client', i);
  user.push(new client(socket.io))
  i++;
  console.log(i);
  if (i == 2)
  {
    io.emit('start', 1);
    updatedirection(ball);
    io.emit('ball', ball);
  }
  socket.on('pad1', (data) => {
    
    // console.log("pad1" ,data);
    io.emit('pad1', data);
  });
  socket.on('pad2', (data) => {
    // console.log("pad2" ,data);
    io.emit('pad2', data);
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected: ', socket.id);
    i--;
  });
});


const port = 3001;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
