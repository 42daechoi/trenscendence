import React, { useRef, useEffect } from "react";
import "../css/GamePage.css";
import { useSocket } from '../component/SocketContext';
import { useNavigate } from "react-router-dom";
import { ballItem, padItem, htmlItem, game} from "../utils/Game.Class"

export default function GamePage() {
  function socketEventoff(){
    socket.off('hostScore');
    socket.off('client');
    socket.off('gameset');
    socket.off("hostWin");
    socket.off("guestWin");
    socket.off('guestScore');
    socket.off('pad1');
    socket.off('ball');
    socket.off('draw');
    socket.off('pad2');
    socket.off('count');
  }
  const navigate = useNavigate();
  function host_win() {
    let score_1 = document.getElementById("score_2");
    let score = score_1.innerText;
    score = parseInt(score) + 1;
    score_1.innerText = score;
  }
  const socket = useSocket();
  function guest_win() {
    let score_2 = document.getElementById("score_1");
    console.log(score_2);
    let score = score_2.innerText;
    score = parseInt(score) + 1;
    score_2.innerText = score;
  }
  let client = -1;
  let ball = new ballItem();
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  let pad = [];
  let obstacle = [];
  let board_x;
  let board_y;
  let ctx;
  let v = 10;
  let r = 20;
  let a = 20;
  let move_px = 2;
  
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

  useEffect(() => {
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


    if (gameRef.current) {
      gameRef.current.addEventListener("keyup", handlKeyup);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.removeEventListener("keyup", handlKeyup);
        console.log("asd");
      }
      socketEventoff();
    };
  }, []);
useEffect(() => {
  const handlKeyDown = (e) => {
    if (e.key == "ArrowUp") {
      e.preventDefault();
      a += 1;
      console.log("client hand ", client)
      pad[client].y -= move_px + Math.log(a) / Math.log(1.05);
      if (pad[client].y < 0) pad[client].y = 0;
      if (client === 0 && socket)
          socket.emit('pad1', pad[client]);
      else if (client === 1 && socket)
          socket.emit('pad2', pad[client]);
    }
    if (e.key == "ArrowDown") {
      e.preventDefault();
      a += 1;
      pad[client].y += move_px + Math.log(a) / Math.log(1.05);
      if (pad[client].y > board_y - pad[client].height)
        pad[client].y = board_y - pad[client].height;
      if (client === 0 && socket)
      
        socket.emit('pad1', pad[client]);
      else if (client === 1 && socket)
        socket.emit('pad2', pad[client]);
    }
  };
  if (socket)
  {
      socket.on('count', (data, callback) => {
        console.log("data", data);
        let count = document.getElementById("count");
        if (data === 0)
        {
          if (client === 0)
          {
            socket.emit("gameStart", "");
          }
          count.hidden = true;
        }
        count.innerText = data;
      });
      socket.on('client', data => {
        console.log("client", data);
        client = data;
      });
      socket.on('hostScore', (data)=>{
        host_win();
        ball.isEqual(data);
      });
      socket.on("hostWin",()=>{
        navigate("/main");
      });
      socket.on("guestWin",()=>{
        navigate("/main");
      });
      socket.on('guestScore', (data)=>{
        guest_win();
        ball.isEqual(data);
      })
      socket.on('pad1', (data) => {
        pad[0] = data;
      });
      ball.x = board_x / 2;
      ball.y = board_y / 2;
      socket.on('ball', (data) => {
        ball.dx = data.dx;
        ball.dy = data.dy;
      });
      socket.on('gameSetting', data => {
        console.log("setting", data);
        for(let i = 0; i < data.pad.length; i++)
        {
          pad.push(new padItem(data.pad[i].x,
            data.pad[i].y,
            data.pad[i].width,
            data.pad[i].height,
            data.pad[i].color,
            data.pad[i].radi)
            );
        }
        ball.isEqual(data.ball);
        board_x = data.board_x;
        board_y = data.board_y;
        if (canvasRef.current)
        {
          canvasRef.current.width = data.board_x;
          canvasRef.current.height = data.board_y;
        }
        for (let i =0; i < data.obs.length; i++)
        {
          obstacle.push(
            new htmlItem(
              data.obs[i].x,
              data.obs[i].y,
              data.obs[i].width,
              data.obs[i].height));
        }
        socket.on('draw', data => {
          ball.isEqual(data);
          draw();
        });
        });
      socket.on('pad2', (data) => {
        pad[1] = data;
      });
      socket.emit("amiHost", "", response => {
        client = response;
        if (client === 0)
        {
          socket.emit("wait", "",);
        }
      });
    }
      if (gameRef.current) {
        gameRef.current.addEventListener("keydown", handlKeyDown);
      }
      return () => {
        if (gameRef.current) {
          gameRef.current.removeEventListener("keydown", handlKeyDown);
          console.log("asd");
          socketEventoff();
        }
      };
  },[socket, canvasRef])
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
          <div id="count">3</div>
          <canvas id="canvas" ref={canvasRef}></canvas>
        </div>
      </div>
    </div>
  );
}
