import React, { useEffect, useRef, useState, KeyboardEvent } from "react";
import Modal from "./Modal";
import "../css/ChannelList.css";
import { useSocket } from "../component/SocketContext";
import { whoami } from "../utils/whoami";
import { getUserByNickname } from "../utils/ApiRequest";
const initChannels: string[] = ["a", "b", "c"];

interface IChannel {
  channelname: string;
  host?: number | null;
  operator: number[];
  users: number[];
  member: number;
  maxmember: number;
  option: string;
  password?: string | null;
}

export default function ChannelsList(props) {
  // 초기 채널 설정
  // const [channelList, setChannelList] = useState<string[]>(props.channelList);//props.channelList
  const [channelList, setChannelList] = useState<IChannel[]>([]);
  const [currChannel, setCurrChannel] = useState<string>("");
  const socket = useSocket();
  let password;

  useEffect(() => {
    setChannelList([]);

    for (let i = 1; i < props.channelList.length; i++) {
      if (props.channelList[i].option != "private") {
        addChannelList(props.channelList[i]);
      }
    }
  }, [props.channelList]);

  const joinChannel = async (password, index) => {
    const data = await whoami();

    socket.emit("join", {
      id: data.id,
      channelname: channelList[index].channelname,
      password: password,
    });
    closeModal();
  };

  function addChannelList(channel: IChannel) {
    setChannelList((prevChannelList) => [...prevChannelList, channel]);
  }
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = (index): void => {
    setModalOpen(true);
    setCurrChannel(index);
  };

  const renderOption = (index) => {
    if (channelList[index].option === "public") return <>🔓</>;
    else return <>🔐</>;
  };

  const closeModal = (): void => {
    setModalOpen(false);
  };

  function ChannelConfigure() {
    const [isPasswordDisplay, setPasswordDisplay] = useState(false);
    const togglePassDisplay = () => {
      setPasswordDisplay(!isPasswordDisplay);
    };

    if (channelList[currChannel].option === "protected") togglePassDisplay();
    return (
      <>
        <div className="channel-access" style={{ padding: "10px" }}>
          <h1 style={{ fontSize: "20px" }}>
            {channelList[currChannel].channelname + " 의 채팅방"}
          </h1>
          <h1>방 설정</h1>
          <div>{channelList[currChannel].option}</div>
          <div>
            {channelList[currChannel].member} /{" "}
            {channelList[currChannel].maxmember}
          </div>
          {isPasswordDisplay && (
            <h1 style={{ padding: "10px" }}>
              password
              <input style={{ margin: "10px" }}></input>
            </h1>
          )}
          <button
            className="join-button"
            onClick={() => {
              joinChannel(password, currChannel);
            }}
          >
            join
          </button>
        </div>
      </>
    );
  }
  const searchText = useRef(null);
  const [currUser, setCurrUser] = useState(null);

  function searchChannel() {
    const searchChannelName = searchText.current.value;
    for (let i = 0; i < channelList.length; i++) {
      if (searchChannelName === channelList[i].channelname) {
        openModal(i);
        searchText.current.value = "";
        return;
      }
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13 && event.key === "Enter") {
      searchChannel();
    }
  };

  return (
    <div className="channel-list">
      {channelList.map((channel, index) => (
        <li key={"channelList" + index}>
          <a className="chat_btn" onClick={() => openModal(index)}>
            {renderOption(index)}
            <div>{channel.channelname}</div>
            <div className="chat_memeber_count">
              {channel.member} / {channel.maxmember}
            </div>
          </a>
        </li>
      ))}
      {isModalOpen && (
        <Modal closeModal={closeModal} ConfigureModal={ChannelConfigure} />
      )}
      <div className="search-side">
        <input ref={searchText} onKeyDown={handleKeyDown} type="text"></input>
        <button className="search-button" onClick={searchChannel}>
          🔍
        </button>
      </div>
    </div>
  );
}
