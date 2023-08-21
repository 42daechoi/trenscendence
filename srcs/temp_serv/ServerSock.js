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

// 클라이언트와 연결이 수립되었을 때 처리
io.on('connection', (socket) => {
  console.log('Client connected: ', socket.id);

  // 클라이언트로부터 메시지를 받았을 때 처리
  socket.on('message', (data) => {
    console.log('Received message: ', data);

    // 모든 클라이언트에게 메시지 전달
    io.emit('message', data);
  });

  // 클라이언트와 연결이 끊어졌을 때 처리
  socket.on('disconnect', () => {
    console.log('Client disconnected: ', socket.id);
  });
});

const port = 3002;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
