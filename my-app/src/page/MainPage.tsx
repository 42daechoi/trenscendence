import React, { useState } from "react";
import "../css/MainPage.css";
import MyProfile from "../component/MyProfile";
import GameWaiting from "../component/GameWaiting";
import LeaderBoard from "../component/LeaderBoard";
import FriendsList from "../component/FriendsList";
import ChannelsList from "../component/ChannelsList";
import ProfileModal from "../component/ProfileModal";
import Chat from "../component/Chat";

export default function MainPage() {
  const [curPage, setCurPage] = useState("leaderboard");

  const renderPage = () => {
    switch (curPage) {
      case "my_profile":
        return <MyProfile />;
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
        return <ChannelsList />;
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
            <Chat></Chat>
          </section>
          <section className="swap-container">{renderPage()}</section>
          <label
            htmlFor="my-drawer-4"
            className="drawer-button btn btn-primary"
          >
            COMM<br></br>◀︎
          </label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
          <ul
            className="menu p-4 w-80 h-full bg-base-200 text-base-content"
            style={{ color: "#8a8a8a" }}
          >
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
            <div className="search-side">
              <input type="text"></input>
              <button>🔍</button>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}
