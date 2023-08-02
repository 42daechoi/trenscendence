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



// For using Socket.io in a Node.js JavaScript project
    const io = require('socket.io-client');
    const socket = io('http://localhost:3001');
    socket.on('message', (data) => {
        console.log('Received message:', data);
      });
      socket.emit('message', 'Hello, asdasd!');

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
  function updatedirection() {
    dy = 0.5 * Math.random() + 0.5;
    dx = 1;
    dx *= Math.random() < 0.5 ? -1 : 1;
    dy *= Math.random() < 0.5 ? -1 : 1;
  }
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const obsRef = useRef(null);
  const padRef1 = useRef(null);
  const padRef2 = useRef(null);
  let pad = [];
  let obstacle = [];
  let board_x;
  let board_y;
  let dx;
  let dy;
  let x;
  let y;
  let ctx;
  let v = 5;
  let r = 20;

  updatedirection();
  let a = 20;
  let move_px = 2;
  function bounce() {
    if (x + r > board_x) {
      x = board_x / 2;
      y = board_y / 2;
      updatedirection();
      player1_win();
    } else if (x - r < 0) {
      x = board_x / 2;
      y = board_y / 2;
      updatedirection();
      player2_win();
    } else if (y + r > board_y || y - r < 0) {
      dy *= -1;
      y += dy * v;
    }
    // bounce_obstacle();
  }
  function draw() {
    x += dx * v;
    y += dy * v;
    bounce();
    bounce_obstacle(obstacle);
    bounce_obstacle(pad);
    ctx.clearRect(0, 0, board_x, board_y);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
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
      ctx.closePath();
    }
    requestAnimationFrame(draw);
  }
  function bounce_obstacle(obs) {
    // console.log(obs.length);
    for (let i = 0; i < obs.length; i++) {
      if (x > obs[i].x && x < obs[i].x + obs[i].width)
      {
        if (y > obs[i].y - r && y < obs[i].y + obs[i].height + r)
        {
          dy *= -1;
          y += dy * v;
        }
      }
      else if (y > obs[i].y && y < obs[i].y + obs[i].height)
      {
        if (x > obs[i].x - r && x < obs[i].x + obs[i].width + r)
        {
          dx *= -1;
          x += dx * v;
        }
      }
      else
      {
        if (Math.sqrt((x - obs[i].x) * (x - obs[i].x) + (y - obs[i].y) * (y - obs[i].y)) < r)
        {
          dx *= -1;
          x += dx * v;
        }
        else if (Math.sqrt((x - obs[i].x - obs[i].width) * (x - obs[i].x - obs[i].width) + (y - obs[i].y) * (y - obs[i].y)) < r)
        {
          dx *= -1;
          x += dx * v;

        }
        else if (Math.sqrt((x - obs[i].x) * (x - obs[i].x) + (y - obs[i].y - obs[i].height) * (y - obs[i].y - obs[i].height)) < r)
        {
          dx *= -1;
          x += dx * v;

        }
        else if (Math.sqrt((x - obs[i].x - obs[i].width) * (x - obs[i].x - obs[i].width) + (y - obs[i].y - obs[i].height) * (y - obs[i].y) - obs[i].height) < r)
        {
          dx *= -1;
          x += dx * v;
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
        pad[1].y -= move_px + Math.log(a) / Math.log(1.05);
        if (pad[1].y < 0) pad[1].y = 0;
      }
      if (e.key == "ArrowDown") {
        e.preventDefault();
        a += 1;
        pad[1].y += move_px + Math.log(a) / Math.log(1.05);
        if (pad[1].y > board_y - pad[1].height)
          pad[1].y = board_y - pad[1].height;
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

    x = board_x / 2;
    y = board_y / 2;
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
    console.log(padRef2.current.offsetWidth);
    console.log(pad[1]);
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
    if (gameRef.current) {
      gameRef.current.addEventListener("keydown", handlKeyDown);
      gameRef.current.addEventListener("keyup", handlKeyup);
    }
    draw();

    return () => {
      if (gameRef.current) {
        gameRef.current.removeEventListener("keydown", handlKeyDown);
        gameRef.current.removeEventListener("keyup", handlKeyup);
      }
      cancelAnimationFrame(draw);
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
