import React, { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import "../css/ChannelList.css";
import { useSocket } from "../component/SocketContext"
import { whoami } from "../utils/whoami";
import { where } from "../utils/where";
import { channel } from "diagnostics_channel";

const initChannels: string[] = ["a", "b", "c"];

export default function ChannelsList(props) {
  // 초기 채널 설정
  // const [channelList, setChannelList] = useState<string[]>(props.channelList);//props.channelList
  const [channelList, setChannelList] = useState<string[]>([]);
  const socket = useSocket();
  let password;

  useEffect(() => {
    console.log(props.channelList);
    for (let i = 0; i < props.channelList.length; i++) {
      addChannelList(props.channelList[i]);
    }
  }, []);

  const joinChannel = async(password) => {
    // try {
    //   const data = await whoami();
    //   const channel = where(socket, "temp");

    //   channel.then(channel => {
        setModalOpen(true);
    //     socket.emit('join', { nickname:data.nickname, channelname:channel.channelname, password:password });
    //   }) .catch (error => {
    //     console.log(error);
    //   })

    // } catch (error) {
    //   console.log(error);
    // }
  }

  function addChannelList(channelName: string) {
    setChannelList((prevChannelList) => [...prevChannelList, channelName]);
  }
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = (): void => {
    joinChannel(password);
  };

  const closeModal = (): void => {
    setModalOpen(false);
  };

  function ChannelConfigure() {
    const [isPasswordDisplay, setPasswordDisplay] = useState(false);
    const togglePassDisplay = () => {
      setPasswordDisplay(!isPasswordDisplay);
    };
    return (
      <>
        <div className="channel-access" style={{ padding: "10px" }}>
          <h1 style={{ fontSize: "20px" }}>daechoi's chat</h1>
          <h1>방 설정</h1>
          <button className="join-button" onClick={togglePassDisplay}>
            password-button
          </button>
          {isPasswordDisplay && (
            <h1 style={{ padding: "10px" }}>
              password
              <input style={{ margin: "10px" }}></input>
              <button className="join-button">join</button>
            </h1>
          )}
        </div>
      </>
    );
  }

  return (
    <div>
      <button
        onClick={() => {
          addChannelList("channel");
        }}
      >
        AddChannel
      </button>
      {channelList.map((channel, index) => (
        <li key={"channelList" + index}>
          <a className="chat_btn" onClick={openModal}>
            <div>🔓</div>
            <div>{channel}</div>
            <div className="chat_memeber_count">8/25</div>
          </a>
        </li>
      ))}
      {isModalOpen && (
        <Modal closeModal={closeModal} ConfigureModal={ChannelConfigure} />
      )}
    </div>
  );
}
