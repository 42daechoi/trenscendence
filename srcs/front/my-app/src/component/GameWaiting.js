import React, { useState, useEffect } from "react";
import { useSocket } from '../component/SocketContext';
import "../css/GameWaiting.css";
import { useNavigate } from "react-router-dom";

export default function GameWaiting() {
  let player = 0;
  const socket = useSocket();
  const navigate = useNavigate();
  const [Ready, setReady] = useState(false);
  const handleButtonClick = () => {
    setReady(!Ready);
  };
  useEffect(() => {
    socket.emit("wait", "");
    socket.on("player", (data) =>{
      console.log("data", data);
      player = data;
    });
    socket.on("Start", () => {
      console.log("a");
      navigate('/game');
    });
  }, [socket]);
  useEffect(() => {
      console.log("ready");
       socket.emit("Ready", Ready);
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
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">게임 어쩌구 선택 어쩌구</span>
            <input type="checkbox" checked="checked" className="checkbox" />
          </label>
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
