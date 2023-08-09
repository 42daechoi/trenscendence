import React, { useRef, useEffect } from "react";
import "../css/GamePage.css";

export default function GamePage() {
  function player1_win() {
    let score_1 = document.getElementById("score_1");
    let score = score_1.innerText;
    score = parseInt(score) + 1;
    score_1.innerText = score;
  }

  function player2_win() {
    let score_2 = document.getElementById("score_2");
    console.log(score_2);
    let score = score_2.innerText;
    score = parseInt(score) + 1;
    score_2.innerText = score;
  }
  let client = -1;
  const io = require('socket.io-client');
  const socket = io('http://localhost:3001');
  class padItem {
    constructor(x, y, width, height, color, radi) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
      this.radi = parseInt(radi);
    }
  }
  class htmlItem {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  }

  class ballItem {
    constructor(){
      this.x = 0;
      this.y = 0;
      this.dx = 0;
      this.dy = 0;
      this.v = 0;
      this.r = 0;
      this.temp = -1;
    }
    init(x, y, dx, dy, v, r, temp){
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.v = v;
      this.r = r;
      this.temp = temp;
    }
  }
  let ball = new ballItem();
  let start = 0;
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const obsRef = useRef(null);
  const padRef1 = useRef(null);
  const padRef2 = useRef(null);
  let pad = [];
  let obstacle = [];
  let board_x;
  let board_y;
  let ctx;
  let v = 10;
  let r = 20;
  let a = 20;
  let move_px = 2;
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
  function draw() {
    ctx.clearRect(0, 0, board_x, board_y);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = pad[0].color;
    ctx.roundRect(pad[0].x, pad[0].y, pad[0].width, pad[0].height, pad[0].radi);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = pad[1].color;
    ctx.roundRect(pad[1].x, pad[1].y, pad[1].width, pad[1].height, pad[1].radi);
    ctx.fill();
    for (let i = 0; i < obstacle.length; i++) {
      ctx.fillStyle = "#5a1515";
      ctx.fillRect(
        obstacle[i].x,
        obstacle[i].y,
        obstacle[i].width,
        obstacle[i].height
      );
    }
    ctx.closePath();
  }
  function pong() {
    ball.x += ball.dx * ball.v;
    ball.y += ball.dy * ball.v;
    bounce();
    bounce_obstacle(obstacle);
    bounce_obstacle(pad);
    draw();
    requestAnimationFrame(pong);
  }
  function bounce_obstacle(obs) {
    // console.log(obs.length);
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
  // function bounce_obstacle(obs) {
  //   // console.log(obs.length);
  //   for (let i = 0; i < obs.length; i++) {
  //     let prevPos_x = x - dx * v;
  //     let prevPos_y = y - dy * v;
  //     let grad_x = (prevPos_y - y) / (prevPos_x - x);
  //     let grad_y = 1 / grad_x;
  //     let obs_x = obs[i].x - r;
  //     let obs_y = obs[i].y - r;
  //     if (dx < 0) obs_x += obs[i].width + 2 * r;
  //     if (dy < 0) obs_y += obs[i].height + 2 * r;
  //     let crash_y;
  //     let crash_x;
  //     if ((x - obs_x) * (prevPos_x - obs_x) < 0) {
  //         crash_y = grad_x * (obs_x - x) + y;
  //       if (crash_y > obs[i].y && crash_y < obs[i].y + obs[i].height) {
  //         dx *= -1;
  //         x += dx * v;
  //       }
  //     }
  //     if ((y - obs_y) * (prevPos_y - obs_y) < 0) {
  //       crash_x = grad_y * (obs_y - y) + x;
  //     if (crash_x > obs[i].x && crash_x < obs[i].x + obs[i].width) {
  //       dy *= -1;
  //       y += dy * v;
  //     }
  //   }
  // }
// }

  useEffect(() => {
    const handlKeyDown = (e) => {
      if (e.key == "Enter") {
        player1_win();
      }
      console.log(e.key);
      if (e.key == "ArrowUp") {
        e.preventDefault();
        a += 1;
        pad[client].y -= move_px + Math.log(a) / Math.log(1.05);
        if (pad[client].y < 0) pad[client].y = 0;
        if (client === 0)
          socket.emit('pad1', pad[client]);
        else if (client === 1)
          socket.emit('pad2', pad[client]);
      }
      if (e.key == "ArrowDown") {
        e.preventDefault();
        a += 1;
        pad[client].y += move_px + Math.log(a) / Math.log(1.05);
        if (pad[client].y > board_y - pad[client].height)
          pad[client].y = board_y - pad[client].height;
        if (client === 0)
          socket.emit('pad1', pad[client]);
        else if (client === 1)
          socket.emit('pad2', pad[client]);
      }
    };
    const handlKeyup = (e) => {
      if (e.key == "ArrowUp") {
        a = 3;
      }
      if (e.key == "ArrowDown") {
        a = 3;
      }
    };
    // Canvas에 그릴 내용을 작성하세요.
    const canvas = canvasRef.current;

    ctx = canvas.getContext("2d");

    board_x = gameRef.current.clientWidth;
    board_y = gameRef.current.clientHeight;
    ball.init(board_x / 2, board_y / 2, 0, 0, v, r, -1);

    pad.push(
      new padItem(
        padRef1.current.offsetLeft,
        padRef1.current.offsetTop,
        padRef1.current.offsetWidth,
        padRef1.current.offsetHeight,
        "#d9d9d9",
        window.getComputedStyle(padRef1.current).borderBottomLeftRadius
      )
    );

    pad.push(
      new padItem(
        padRef2.current.offsetLeft,
        padRef2.current.offsetTop,
        padRef2.current.offsetWidth,
        padRef2.current.offsetHeight,
        "#ffe500",
        window.getComputedStyle(padRef2.current).borderBottomLeftRadius
      )
    );
    canvas.width = board_x;
    canvas.height = board_y;

    let obstacles = obsRef.current;
    let obj = obstacles.firstElementChild;
    while (obj != null) {
      obstacle.push(
        new htmlItem(
          obj.offsetLeft,
          obj.offsetTop,
          obj.clientWidth,
          obj.clientHeight
        )
      );
      obj = obj.nextElementSibling;
    }
    socket.on('start', (data) => {
      start = data;
      requestAnimationFrame(() => {console.log("b")});
      pong();
    });
    socket.on('client', (data) => {
      console.log(data);
      requestAnimationFrame(() => {console.log("a")});
      client = data;
    });
    socket.on('pad1', (data) => {
      pad[0] = data;
    });
    ball.x = board_x / 2;
    ball.y = board_y / 2;
    socket.on('ball', (data) => {
      ball.dx = data.dx;
      ball.dy = data.dy;
    });
    socket.on('pad2', (data) => {
      pad[1] = data;
    });
    if (client === 0)
      socket.emit('pad1', pad[client]);
    else if (client === 1)
      socket.emit('pad2', pad[client]);
    if (gameRef.current) {
      gameRef.current.addEventListener("keydown", handlKeyDown);
      gameRef.current.addEventListener("keyup", handlKeyup);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.removeEventListener("keydown", handlKeyDown);
        gameRef.current.removeEventListener("keyup", handlKeyup);
        console.log("asd");
      }
      cancelAnimationFrame(pong);
    };
  }, []);
  return (
    <div className="background">
      <div className="pong">
        <div className="info">
          <div className="user1">user1</div>
          <div id="p1" className="p1">
            <div id="score_1">0</div>
          </div>
          <div id="p2" className="p2">
            <div id="score_2">0</div>
          </div>
          <div id="user2" className="user2">
            user2
          </div>
        </div>
        <div className="gameset" ref={gameRef} tabIndex={0}>
          <canvas id="canvas" ref={canvasRef}></canvas>
          <div className="pad1" ref={padRef1}></div>
          <div className="pad2" ref={padRef2}></div>
          <div className="obstacle" ref={obsRef}>
            <div id="obstacle1"></div>
            <div id="obstacle2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
