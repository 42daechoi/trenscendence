import React, { useState, KeyboardEvent, useEffect, useRef } from "react";
import ProfileModal from "../component/ProfileModal";
import "../css/Chat.css";

interface IUsers {
  name: string;
  profile: any;
  id: number;
}

interface IMessage {
  user: IUsers;
  sender: string;
  text: string;
  time: string;
}

export default function Chat() {
  const [users, setUsers] = useState<IUsers[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  function addUsers(name: string) {
    setUsers([...users, { name: name, profile: null, id: 1 }]);
  }

  const addMessage = (user: IUsers, text: string) => {
    const time = new Date().toLocaleTimeString();
    // start = 상대방 end = 자신
    // if (user.id == myid)
    const className = "chat chat-end";
    // else
    // const className = "chat chat-start";

    setMessages([
      ...messages,
      { user: user, sender: "s", text: text, time: time },
    ]);
  };

  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    // keyCode는 잘 사용되지 않는다고한다. 추후 리팩토링 예정
    if (event.keyCode === 13 && event.key === "Enter" && !event.shiftKey) {
      const target = event.target as HTMLInputElement;
      console.log(target.value);
      event.preventDefault();
      if (target && target.value.length) {
        addMessage({ name: "gyyu", profile: null, id: 0 }, target.value);
        target.value = "";
      }
    }
  };
  useEffect(() => {
    return () => {
      scrollToBottom();
    };
  }, [messages]);

  return (
    <>
      <div className="chat-box">
        <h1>채팅방 제목</h1>
        {/* 상대방 채팅 임시 */}
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img src="/img/img.jpg" alt="chat profile img" />
            </div>
          </div>
          <div className="chat-header">
            Obi-Wan Kenobi <time className="text-xs opacity-50">12:45</time>
          </div>
          <div className="chat-bubble">You were the Chosen One!</div>
          {/* <div className="chat-footer opacity-50">Delivered</div> */}
        </div>
        {/* 상대방 채팅 임시 */}
        <div ref={lastMessageRef}>
          {messages.map((message, index) => (
            <div
              className={"chat chat-end"}
              ref={index === messages.length - 1 ? lastMessageRef : null}
              key={index}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img src="/img/img.jpg" alt="chat profile img" />
                </div>
              </div>
              <div className="chat-header">
                {message.user.name}
                <time className="text-xs opacity-50">{message.time}</time>
              </div>
              <div className="chat-bubble">{message.text}</div>
              {/* <div className="chat-footer opacity-50"> Seen at {message.time}</div> */}
            </div>
          ))}
        </div>
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="채팅을 입력하세요."
          className="input input-bordered input-accent w-full max-w-xs"
          onKeyDown={handleKeyPress}
        />
        <button className="btn btn-active btn-primary">↵</button>
      </div>
      <div className="chat-member-list">
        <ul>
          {users.map((user, index) => (
            // {/* 추후 key 값을 index 대신 id로 대체 */}
            <li key={index}>
              <input type="checkbox" />
              <ProfileModal name={user.name + index}></ProfileModal>
            </li>
          ))}
        </ul>
        <div className="chat-member-button">
          <button>home</button>
          <button>mute</button>
          <button>kick</button>
          <button onClick={() => addUsers("ma")}>addUser</button>
        </div>
      </div>
    </>
  );
}
