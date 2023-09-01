import React, { useState, useEffect } from "react";

import "../css/MainPage.css";
import Profile from "../component/Profile";
import GameWaiting from "../component/GameWaiting";
import LeaderBoard from "../component/LeaderBoard";
import FriendsList from "../component/FriendsList";
import ChannelsList from "../component/ChannelsList";
import MemoChat from "../component/Chat";
import io from "socket.io-client";
import axios from "axios";
import { useSocket } from "../component/SocketContext";
import { getWhoami } from "../utils/ApiRequest";

export default function MainPage() {
  const [curPage, setCurPage] = useState("my_profile");
  const [channelList, setChannelList] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket)
      return ;
    socket.on("allinfo", (data) => {
      getWhoami()
        .then((response) => {
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].users.length; j++) {
              if (data[i].users[j] === response.data.id) {
                if (JSON.stringify(data) === JSON.stringify(channelList))
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
      socket.off("allinfo");
    };
  }, [socket]);

  const renderPage = () => {
    switch (curPage) {
      case "my_profile":
        return <Profile currUser="gyyu" />;
      case "game_waiting":
        return <GameWaiting />;
      case "leaderboard":
        return <LeaderBoard />;
    }
  };
  const [curSide, setCurSide] = useState("friends_list");
  const [friendsButtonClass, setFriendsButtonClass] =
    useState("clicked-button");
  const [channelsButtonClass, setChannelsButtonClass] =
    useState("default-button");

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
        return <ChannelsList channelList={channelList} />;
    }
  };

  return (
    <div className="background">
      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <section className="btn-container">
            <button
              className="btn btn-outline btn-success"
              onClick={() => setCurPage("game_waiting")}
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
            <MemoChat memberList={memberList} />
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
            <div className="search-side ">
              <input type="text"></input>
              <button>🔍</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
