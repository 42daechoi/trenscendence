import React, { useState, KeyboardEvent, useEffect, useRef } from "react";

import "../css/MainPage.css";
import MemoProfile from "../component/Profile";
import GameWaiting from "../component/GameWaiting";
import LeaderBoard from "../component/LeaderBoard";
import FriendsList from "../component/FriendsList";
import MemoChannelsList from "../component/ChannelsList";
import MemoChat from "../component/Chat";
import { getWhoami } from "../utils/ApiRequest";
import Modal from "../component/Modal";
import {
  useSocket,
  useGameSocket,
  useCurPage,
} from "../component/SocketContext";
import { apiRequest } from "../utils/ApiRequest";

export default function MainPage() {
  const [isMatch, setIsMatch] = useState(false);
  const [play, setPlay] = useState(false);
  const [matchInfo, setMatchInfo] = useState(null);
  const sideRef = useRef(null);
  const gameSocket = useGameSocket();
  const [curPage, setCurPage] = useState("my_profile");
  const [channelList, setChannelList] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const socket = useSocket();
  const [myId, setMyId] = useState(0);
  const { match, set } = useCurPage();
  useEffect(() => {
    if (curPage !== "game_waiting") setPlay(false);
    set("");
  }, [curPage]);
  useEffect(() => {
    if (match === "match") {
      sideRef.current.checked = false;
      setIsMatch(true);
    }
    if (match === "accept") {
      sideRef.current.checked = false;
      setIsMatch(false);
      setPlay(true);
      setCurPage("game_waiting");
    }
    if (match === "deny") {
      closeMatch();
      setPlay(false);
    }
    return () => {
      set("");
    };
  }, [match]);

  useEffect(() => {
    if (!socket) return;
    gameSocket.on("OneOnOneNoti", (data) => {
      console.log("게임초대");
      set("match");
      setMatchInfo(data.id);
    });
    socket.on("allinfo", (data) => {
      getWhoami()
        .then((response) => {
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].users.length; j++) {
              if (data[i].users[j] === response.data.id) {
                if (JSON.stringify(data) != JSON.stringify(channelList))
                  setChannelList(data);
                if (JSON.stringify(data[i].users) != JSON.stringify(memberList))
                  setMemberList(data[i].users);
                return;
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
    return () => {
      gameSocket.off("OneOnOneNoti");
      socket.off("allinfo");
    };
  }, [socket]);

  useEffect(() => {
    apiRequest<any>("get", "http://localhost:3001/users/whoami").then(
      (response) => {
        setMyId(response.data.id);
      }
    );
    return () => {};
  }, []);

  const renderPage = () => {
    switch (curPage) {
      case "my_profile":
        return <MemoProfile currUser={myId} isMe={true} />;
      case "game_waiting":
        return <GameWaiting leavefun={leaveGameWaiting} type={play} />;
      case "leaderboard":
        return <LeaderBoard />;
    }
  };
  const [curSide, setCurSide] = useState("friends_list");
  const [friendsButtonClass, setFriendsButtonClass] =
    useState("clicked-button");
  const [channelsButtonClass, setChannelsButtonClass] =
    useState("default-button");
  const leaveGameWaiting = () => {
    setCurPage("my_profile");
  };

  const handleButtonClick = (side) => {
    if (side === "friends_list") {
      setCurSide("friends_list");
      setFriendsButtonClass("clicked-button");
      setChannelsButtonClass("default-button");
    } else if (side === "channels_list") {
      setCurSide("channels_list");
      setFriendsButtonClass("default-button");
      setChannelsButtonClass("clicked-button");
    }
  };
  const renderSide = () => {
    switch (curSide) {
      case "friends_list":
        return <FriendsList />;
      case "channels_list":
        return <MemoChannelsList channelList={channelList} />;
    }
  };

  const closeMatch = (): void => {
    setIsMatch(false);
    console.log("closeMatch");
    if (gameSocket && match !== "accept") gameSocket.emit("denyOneOnOne", "");
  };

  return (
    <div className="background">
      {matchInfo && isMatch && (
        <Modal
          closeModal={closeMatch}
          ConfigureModal={() => (
            <MemoProfile currUser={matchInfo} isMe={false} match={isMatch} />
          )}
        />
      )}
      <div className="drawer drawer-end">
        <input
          id="my-drawer-4"
          type="checkbox"
          className="drawer-toggle"
          ref={sideRef}
        />
        <div className="drawer-content">
          <section className="btn-container">
            <button
              className="btn btn-outline btn-success"
              onClick={() => {
                curPage !== "game_waiting" && setCurPage("game_waiting");
              }}
            >
              GAME START
            </button>
            <button
              className="btn btn-outline btn-warning"
              onClick={() => setCurPage("my_profile")}
            >
              MY PROFILE
            </button>
            <button
              className="btn btn-outline btn-error"
              onClick={() => setCurPage("leaderboard")}
            >
              LEADERBOARD
            </button>
          </section>
          <section className="chat-container">
            <MemoChat memberList={memberList} type={curPage} />
          </section>
          <section className="swap-container">{renderPage()}</section>
          <label
            htmlFor="my-drawer-4"
            className="drawer-button btn btn-primary"
            style={{ position: "fixed", right: "0" }}
          >
            COMM<br></br>◀︎
          </label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-4" className="drawer-overlay" />
          <div
            className="menu p-4 w-80 h-full bg-base-200 text-base-content"
            style={{ color: "#8a8a8a" }}
          >
            <div className="side-list">
              <div className="button-side">
                <button
                  className={friendsButtonClass}
                  onClick={() => handleButtonClick("friends_list")}
                >
                  FRIENDS
                </button>
                <button
                  className={channelsButtonClass}
                  onClick={() => handleButtonClick("channels_list")}
                >
                  CHANNELS
                </button>
              </div>
              <div className="list">{renderSide()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
