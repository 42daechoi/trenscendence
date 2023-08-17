import React, { useState, KeyboardEvent, useEffect, useRef } from "react";
import ProfileModal from "../component/ProfileModal";
import "../css/Chat.css";

interface IUsers {
  name: string;
  profile: any;
  id: number;
  isMute: boolean;
  isChecked: boolean;
}

interface IMessage {
  user: IUsers;
  sender: string;
  text: string;
  time: string;
}

const initTmpUsers: IUsers[] = [
  { name: "Obi-Wan Kenobi", profile: null, id: 0, isMute:false, isChecked:false },
  { name: "daechoi", profile: null, id: 0, isMute:false, isChecked:false },
  { name: "youhan", profile: null, id: 0, isMute:false, isChecked:false },
  { name: "gyyu", profile: null, id: 0, isMute:false, isChecked:false },
];
const initTmpMessages: IMessage[] = [
  {
    user: { name: "Obi-Wan Kenobi", profile: null, id: 1, isMute:false, isChecked:false },
    sender: "chat chat-start",
    text: "You were the Chosen One!",
    time: new Date().toLocaleTimeString(),
  },
];

export default function Chat(props) {
  // 임시 초기값 지정
  const [users, setUsers] = useState<IUsers[]>(initTmpUsers);
  const [messages, setMessages] = useState<IMessage[]>(initTmpMessages);
  // const [users, setUsers] = useState<IUsers[]>([]);
  // const [messages, setMessages] = useState<IMessage[]>([]);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const setMute = () => {
    for (let i:number = 0;i < users.length; i++) {
      if (users[i].isChecked && !users[i].isMute)
        users[i].isMute = true;
      if (!users[i].isChecked && users[i].isMute)
        users[i].isMute = false;
        console.log(users[i].isMute);//삭제해야함
    }
  }

  function addUsers(name: string) {
    setUsers([...users, { name: name, profile: null, id: 1, isMute:false, isChecked: false}]);
  }

  const addMessage = (user: IUsers, text: string, className: string) => {
    const time = new Date().toLocaleTimeString();
    // start = 상대방 end = 자신
    // if (user.id == myid)
    // else
    // const className = "chat chat-start";

    setMessages([
      ...messages,
      { user: user, sender: className, text: text, time: time },
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
        addMessage({ name: "gyyu", profile: null, id: 0, isMute:false, isChecked:false }, target.value, "chat chat-end");
        target.value = "";
      }
    }
  };
  useEffect(() => {
    return () => {
      scrollToBottom();
    };
  }, [messages]);

  // useEffect(() => {
  //   props.socket.on('message', receiveMessage);

  //   return () => {
  //     props.socket.off('message', receiveMessage);
  //   };
  // }, []);

  const receiveMessage = (msg) => {
    addMessage({ name: "daechoi", profile: null, id: 1, isMute:false, isChecked:false }, msg, "chat chat-start");
  }

  return (
    <>
      <div className="chat-box">
        <h1>채팅방 제목</h1>
        <div ref={lastMessageRef}>
          {messages.map((message, index) => (
            <div
              className={message.sender}
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
            <li key={"chat" + index}>
              <input type="checkbox"  onChange={() => users[index].isChecked = users[index].isChecked ? false:true}/>
              <ProfileModal name={user.name + index} currUser="ohter" />
            </li>
          ))}
        </ul>
        <div className="chat-member-button">
          <button>home</button>
          <button onClick={setMute}>mute</button>
          <button>kick</button>
          <button onClick={() => addUsers("ma")}>addUser</button>
        </div>
      </div>
    </>
  );
}
