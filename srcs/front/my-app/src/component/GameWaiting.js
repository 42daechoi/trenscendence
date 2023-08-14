import React, { useState, useEffect } from "react";
import { useSocket } from '../component/SocketContext';
import "../css/GameWaiting.css";
import { useNavigate } from "react-router-dom";

export default function GameWaiting() {
  const navigate = useNavigate();
  const [Ready, setReady] = useState(false);
  const handleButtonClick = (event) => {
    setReady(true);
    console.log(Ready);
  };
  useEffect(() => {
    if (Ready) {
      console.log("wait");
      navigate("/game");
    }
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
