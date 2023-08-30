import React, { useState } from "react";
import "../css/LeaderBoard.css";

type leaderBoardState = {
  nickname: string;
  gameLog: string;
  rate: string;
};

const initLBS: leaderBoardState[] = [
  { nickname: "daechoi", gameLog: "30전 20승 10패", rate: "66.6%" },
  { nickname: "김두한", gameLog: "30전 10승 20패", rate: "33.3%" },
  { nickname: "김두한", gameLog: "10전 10승 0패", rate: "100%" },
];

const styles: string[] = ["gold", "silver", "#af6114"];

export default function LeaderBoard() {
  const [leaderBoard, setLeaderBoard] = useState<leaderBoardState[]>(initLBS);
  return (
    <div className="leaderboard-container">
      <ul>
        {leaderBoard.map((data, index) => (
          <li className="ranklist" key={"leaderBoard " + index}>
            <div className="rank" style={{ color: styles[index] }}>
              {index + 1}
            </div>
            <div className="nickname">{data.nickname}</div>
            <div className="number">{data.gameLog}</div>
            <div className="ratio">{data.rate}</div>
          </li>
        ))}
        {/* <li className="ranklist">
          <div className="rank" style={{ color: "gold" }}>
            1
          </div>
          <div className="nickname">daechoi</div>
          <div className="number">30전 20승 10패</div>
          <div className="ratio">66.6%</div>
        </li>
        <li className="ranklist">
          <div className="rank" style={{ color: "silver" }}>
            2
          </div>
          <div className="nickname">김두한</div>
          <div className="number">30전 10승 20패</div>
          <div className="ratio">33.3%</div>
        </li>
        <li className="ranklist">
          <div className="rank" style={{ color: "#af6114" }}>
            3
          </div>
          <div className="nickname">김두한</div>
          <div className="number">10전 10승 0패</div>
          <div className="ratio">100%</div>
        </li> */}
      </ul>
    </div>
  );
}
