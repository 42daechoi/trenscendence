import React, { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import "../css/ChannelList.css";
import { useSocket } from "../component/SocketContext"
import { whoami } from "../utils/whoami";
import { where } from "../utils/where";
import { channel } from "diagnostics_channel";

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
  const socket = useSocket();
  let password;

  useEffect(() => {
    setChannelList([]);
    for (let i = 0; i < props.channelList.length; i++) {
      if (props.channelList[i].option != 'private')
        addChannelList(props.channelList[i].channelname);
    }
  }, [props.channelList]);


  const joinChannel = async(password, index) => {
      const data = await whoami();

      setModalOpen(true);
      socket.emit('join', { id:data.id, channelname:channelList[index], password:password });
  }

  function addChannelList(channel:IChannel) {
    setChannelList((prevChannelList) => [...prevChannelList, channel]);
  }
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = (index): void => {
    joinChannel(password, index);
  };

  const renderOption = (index) => {
    if (channelList[index].option === 'public')
      return (<>🔓</>)
    else
      return (<>🔐</>)
  }

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
      {channelList.map((channel, index) => (
        <li key={"channelList" + index}>
          <a className="chat_btn" onClick={() => openModal(index)}>
            {renderOption(index)}
            <div>{channel.channelname}</div>
            <div className="chat_memeber_count">{channel.member}/{channel.maxmember}</div>
          </a>
        </li>
      ))}
      {isModalOpen && (
        <Modal closeModal={closeModal} ConfigureModal={ChannelConfigure} />
      )}
    </div>
  );
}
