import React, { useRef, useState, useEffect } from "react";
import { useSocket } from './SocketContext';
import "../css/GameWaiting.css";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/ApiRequest";
import "../css/GamePage.css"
import { ballItem, padItem, htmlItem, game } from "../utils/Game.Class";
export default function GameWaiting() {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const obsRef = useRef(null);
  const padRef1 = useRef(null);
  const padRef2 = useRef(null);
  const socket = useSocket();
  const navigate = useNavigate();
  const [Ready, setReady] = useState(false);
  const [State, setState] = useState(false);
  const [MapNum, setMapNum] = useState(1);
  const [BallNum, setBallNum] = useState(2);
  const [SpeedNum, setSpeedNum] = useState(2);
  const [PadNum, setPadNum] = useState(2);
  const gameset = new game([], 0, 0, new ballItem(0,0,0,0,0,0), []);
  const pad = [];
  const obstacle = [];
  const ball = new ballItem(0,0,0,0,0,0);
  let board_x;
  let board_y;
  let ctx;
  let v = 6;
  let r = 12;
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
  function updatedirection(ball) {
    ball.dy = 0.5 * Math.random() + 0.5;
    ball.dx = 1;
    ball.dx *= Math.random() < 0.5 ? -1 : 1;
    ball.dy *= Math.random() < 0.5 ? -1 : 1;
  }
  

  function bounce() {
    if (ball.x + ball.r > board_x) {
      ball.dx *= -1;
      ball.x += ball.dx * ball.v;
      ball.temp = -1;
    } else if (ball.x - ball.r < 0) {
      ball.dx *= -1;
      ball.x += ball.dx * ball.v;
      ball.temp = -1;
    } else if (ball.y + ball.r > board_y|| ball.y - ball.r < 0) {
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
    draw();
  }

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
  const handleButtonClick = () => {
    setReady(!Ready);
  };
  function gameSettingbutton(list :string, num:number, set: React.Dispatch<React.SetStateAction<number>>){
    function gameSettingNum(num :number){
      if (num === 5)
        set(1);
      else if(num === 0)
        set(4);
      else 
        set(num);
    }
    return (
      <div className="game-setting-button">
      <div className="key">{list}</div>
      <div className="value">
        <button className="arrow left" onClick={() => gameSettingNum(num - 1)}></button>
        <div>{num}</div>
        <button className="arrow right" onClick={() => gameSettingNum(num + 1)}></button>
      </div>
    </div>
    )
  };
  function init(){
    clearInterval(gameset.intervalId);
    const canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    board_x = gameRef.current.clientWidth;
    board_y = gameRef.current.clientHeight;
    ball.init(board_x / 2, board_y / 2, 1, 1, v, r, -1);

    pad.push(
      new padItem(
        padRef1.current.offsetLeft,
        padRef1.current.offsetTop,
        padRef1.current.offsetWidth,
        padRef1.current.offsetHeight,
        "#d9d9d9",
        parseInt(window.getComputedStyle(padRef1.current).borderBottomLeftRadius)
      )
    );

    pad.push(
      new padItem(
        padRef2.current.offsetLeft,
        padRef2.current.offsetTop,
        padRef2.current.offsetWidth,
        padRef2.current.offsetHeight,
        "#ffe500",
        parseInt(window.getComputedStyle(padRef2.current).borderBottomLeftRadius)
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
    gameset.ball.isEqual(ball);
    gameset.board_x = board_x;
    gameset.board_y = board_y;
    for (let i = 0; i < obstacle.length; i++)
    {
      gameset.obs.push(obstacle[i].x,
        obstacle[i].y,
        obstacle[i].width,
        obstacle[i].height
      )
    }
    for (let i = 0; i < pad.length; i++)
    {
      gameset.obs.push(pad[i].x,
        pad[i].y,
        pad[i].width,
        pad[i].height,
        pad[i].radi
      )
    }
    pad[0].height = 20 * (PadNum - 1) + 116;
    pad[1].height = 20 * (PadNum - 1) + 116;
    ball.v = 4 * (SpeedNum - 1) + 2;
    obstacle.splice(MapNum - 1, 4 - MapNum);
    ball.r = 5 * (BallNum - 1) + 7;
    gameset.intervalId = setInterval(()=>{
      pong();
    }, 20);
  }

  useEffect(() => {
    init();
    return () => {
      clearInterval(gameset.intervalId);
      socket.off("matching waiting");
      socket.off("matchInfo");
      socket.off("allReady");
    }
  },[PadNum, SpeedNum, BallNum, MapNum]);


  useEffect(() => {
      if (socket)
      {
        socket.on("matching waiting", data => {
          console.log(data);
        });
        socket.on("matchInfo", data => {
          setState(true);
          if (Ready)
            socket.emit("ready", "");
        });
        socket.on("allReady",() => {
          navigate("/game");
        })
        socket.emit("match", "");
      };
  }, [socket]);
  useEffect(() => {
      console.log(Ready);
      if (Ready && State)
        socket.emit("ready", Ready);
      else if (!Ready && State)
        socket.emit("unReady", Ready);
  }, [Ready]);
  return (
    <div className="game-waiting-container">
      <div className="player">
        <div>daechoi</div>
        <div>vs</div>
        <div>
          <div className="btn-loading btn-square">  
            <span className="loading loading-spinner"></span>
          </div>
        </div>
      </div>
      <div className="game-setting">
        <div className="mini-map" ref={gameRef}>
          <canvas id="canvas" ref={canvasRef}></canvas>
          <div className="pad1" ref={padRef1}></div>
          <div className="pad2" ref={padRef2}></div>
          <div className="obstacle" ref={obsRef}>
            <div id="obstacle1"></div>
            <div id="obstacle2"></div>
            <div id="obstacle3"></div>
        </div>
      </div>
      <div className="game-setting-list">
        {gameSettingbutton("맵", MapNum, setMapNum)}
        {gameSettingbutton("공 크기", BallNum, setBallNum)}
        {gameSettingbutton("공 속도", SpeedNum, setSpeedNum)}
        {gameSettingbutton("pad 크기", PadNum, setPadNum)}
      </div>
      </div>
      <div className="ready-button">
        <button
          className="btn-ready btn-outline btn-success"
          onClick={handleButtonClick}
        >
          READY
        </button>
        <button className="btn-leave btn-outline btn-error">LEAVE</button>
      </div>
    </div>
  );
}
