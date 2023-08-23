import React, { useState, KeyboardEvent, useEffect, useRef } from "react";
import { useSocket } from "../component/SocketContext";
import ProfileModal from "../component/ProfileModal";
import Modal from "../component/Modal";
import { whoami } from "../utils/whoami";
import "../css/Chat.css";
import { where } from "../utils/where";
import { defaultMaxListeners } from "events";
import axios from "axios";
import { response } from "express";

interface IUsers {
  name: string;
  profile: any;
  id: number;
  isChecked: boolean;
}

interface IMessage {
  user: IUsers;
  sender: string;
  text: string;
  time: string;
}

const initTmpUsers: IUsers[] = [
  { name: "Obi-Wan Kenobi", profile: null, id: 0, isChecked: false },
  { name: "daechoi", profile: null, id: 0, isChecked: false },
  { name: "youhan", profile: null, id: 0, isChecked: false },
  { name: "gyyu", profile: null, id: 0, isChecked: false },
];
const initTmpMessages: IMessage[] = [
  {
    user: { name: "Obi-Wan Kenobi", profile: null, id: 1, isChecked: false },
    sender: "chat chat-start",
    text: "You were the Chosen One!",
    time: new Date().toLocaleTimeString(),
  },
];

export default function Chat(props) {
  // 임시 초기값 지정
  const [users, setUsers] = useState<IUsers[]>(initTmpUsers);
  const [messages, setMessages] = useState<IMessage[]>(initTmpMessages);
  const socket = useSocket();
  // const [users, setUsers] = useState<IUsers[]>([]);
  // const [messages, setMessages] = useState<IMessage[]>([]);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  function addUsers(name: string) {
    setUsers([
      ...users,
      { name: name, profile: null, id: 1, isChecked: false },
    ]);
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

  const handleKeyPress = async (event: KeyboardEvent<HTMLInputElement>) => {
    // keyCode는 잘 사용되지 않는다고한다. 추후 리팩토링 예정
    if (event.keyCode === 13 && event.key === "Enter" && !event.shiftKey) {
      const target = event.target as HTMLInputElement;
      console.log(target.value);
      event.preventDefault();
      try {
        const data = await whoami();
        //닉네임이 뮤트인 경우를 대비해 닉네임 수정 시 5자 이상 강제
        if (target && target.value.substring(0, 6) === "/mute ") {
          const target_name: string = target.value.substring(7, target.value.length - 1);
          axios.get('http://localhost:3001/users/nickname/' + target_name, { withCredentials: true })
            .then ( response => {
              axios.patch('http://localhost:3001/users/blocks/add/' + response.data.id, { withCredentials:true })
                .catch( error => {
                  console.log(error);
                })
            })
            .catch (error => {
              console.log(error);
            })
          return;
        }
        else if (target && target.value.substring(0, 8) === "/unmute ") {
          const target_name: string = target.value.substring(7, target.value.length - 1);
          axios.get('http://localhost:3001/users/nickname/' + target_name, { withCredentials: true })
          .then ( response => {
            axios.patch('http://localhost:3001/users/blocks/remove/' + response.data.id, { withCredentials:true })
              .catch( error => {
                console.log(error);
              })
          })
          .catch (error => {
            console.log(error);
          })
          return;
        }
        else if (target && target.value.substring(0, 9) === "/mutelist") {
          axios.get('http://localhost:3001/users/blocks/list', { withCredentials: true })
          .catch (error => {
            console.log(error);
          })
          return;
        }
        else if (target && target.value[0] === "/" && target.value[1] === '/') {
          const firstSpaceIdx = target.value.indexOf(" ");
          const target_name: string = target.value.substring(2, firstSpaceIdx);
          const msg: string = target.value.substring(
            firstSpaceIdx,
            target.value.length - 1
          );

          socket.emit("chat", {
            nickname: data.nickname,
            target: target_name,
            flag: "dm",
            msg: msg,
          });
          addMessage(
            {
              name: data.nickname,
              profile: null,
              id: data.id,
              isChecked: false,
            },
            target.value,
            "chat chat-end"
          );
          target.value = "";
          return;
        }
        else if (target && target.value.length) {
          const channel = where(socket, data.nickname);

          channel
            .then((channel) => {
              console.log(channel);
              socket.emit("chat", {
                nickname: data.nickname,
                target: "channel",
                flag: "broad",
                msg: target.value,
              });
            })
            .catch((error) => {
              console.log(error);
            });
          addMessage(
            {
              name: data.nickname,
              profile: null,
              id: data.id,
              isChecked: false,
            },
            target.value,
            "chat chat-end"
          );
        }
      } catch (error) {
        console.log(error);
      }
      target.value = "";
    }
  };

  useEffect(() => {
    return () => {
      scrollToBottom();
    };
  }, [messages]);

  const kick = async () => {
    try {
      const data = await whoami();
      for (let i: number = 0; i < users.length; i++) {
        if (users[i].isChecked)
          socket.emit("kick", {
            nickname: data.nickname,
            target: users[i].name,
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const goHome = async() => {
    try {
      const data = await whoami();
      socket.emit("home", data.nickname);
    } catch (error) {
      console.log(error);
    }
  }

  const givePermission = async () => {
    try {
      const data = await whoami();
      for (let i: number = 0; i < users.length; i++) {
        if (users[i].isChecked)
          socket.emit("op", { nickname: data.nickname, target: users[i].name });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setChannel = async () => {
    try {
      const data = await whoami();
    } catch (error) {
      console.log(error);
    }
  };

  const receiveMessage = (msg) => {
    addMessage(
      { name: "daechoi", profile: null, id: 1, isChecked: false },
      msg,
      "chat chat-start"
    );
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = (): void => {
    setModalOpen(true);
  };

  const closeModal = (): void => {
    setModalOpen(false);
  };
  const [chatConfigure, setChatConfigure] = useState("");

  function ChatSetting() {
    const [isChecked, setChecked] = useState("public");
    return (
      <div id="ChatSetting">
        <h1
          style={{
            fontSize: "30px",
            textAlign: "center",
            padding: "10px",
          }}
        >
          채팅방 설정
        </h1>
        <div className="container">
          <div className="form-container">
            <form>
              <label>
                <input
                  type="radio"
                  name="public"
                  checked={isChecked === "public"}
                  onChange={(e) => {
                    setChecked(e.target.name);
                  }}
                ></input>
                <span>PUBLIC</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="protected"
                  checked={isChecked === "protected"}
                  onChange={(e) => {
                    setChecked(e.target.name);
                  }}
                ></input>
                <span>PROTECTED</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="private"
                  checked={isChecked === "private"}
                  onChange={(e) => {
                    setChecked(e.target.name);
                  }}
                ></input>
                <span>PRIVATE</span>
              </label>
            </form>
            <div className="chat-set-right">
              <div className="max-People" style={{ padding: "10px" }}>
                최대 수용 인원
                <select
                  style={{ marginLeft: "10px" }}
                  name="max-people"
                  className="select"
                >
                  {Array(24)
                    .fill(0)
                    .map((_, i) => (
                      <option key={i} value={i + 2}>
                        {i + 2}
                      </option>
                    ))}
                </select>
              </div>
              {isChecked === "protected" && (
                <div style={{ padding: "10px" }}>
                  password
                  <input type="text" style={{ marginLeft: "10px" }} />
                </div>
              )}
            </div>
          </div>
        </div>
        <button className="setting-button">수정</button>
      </div>
    );
  }

  function CreateChat() {
    const [isChecked, setChecked] = useState("public");

    return (
      <div id="ChatSetting">
        <h1
          style={{
            fontSize: "30px",
            textAlign: "center",
            padding: "10px",
          }}
        >
          채팅방 생성
        </h1>
        <div className="container">
          <div className="form-container">
            <form>
              <label>
                <input
                  type="radio"
                  name="public"
                  checked={isChecked === "public"}
                  onChange={(e) => {
                    setChecked(e.target.name);
                  }}
                ></input>
                <span>PUBLIC</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="protected"
                  checked={isChecked === "protected"}
                  onChange={(e) => {
                    setChecked(e.target.name);
                  }}
                ></input>
                <span>PROTECTED</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="private"
                  checked={isChecked === "private"}
                  onChange={(e) => {
                    setChecked(e.target.name);
                  }}
                ></input>
                <span>PRIVATE</span>
              </label>
            </form>
            <div className="chat-set-right">
              <div className="max-People" style={{ padding: "10px" }}>
                최대 수용 인원
                <select
                  style={{ marginLeft: "10px" }}
                  name="max-people"
                  className="select"
                >
                  {Array(24)
                    .fill(0)
                    .map((_, i) => (
                      <option key={i} value={i + 2}>
                        {i + 2}
                      </option>
                    ))}
                </select>
              </div>
              {isChecked === "protected" && (
                <div style={{ padding: "10px" }}>
                  password
                  <input type="text" style={{ marginLeft: "10px" }} />
                </div>
              )}
            </div>
          </div>
        </div>
        <button className="setting-button">생성</button>
      </div>
    );
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
              <input
                type="checkbox"
                onChange={() =>
                  (users[index].isChecked = users[index].isChecked
                    ? false
                    : true)
                }
              />
              <ProfileModal name={user.name + index} currUser="ohter" />
            </li>
          ))}
        </ul>
        <div className="chat-member-button">
          <button onClick={goHome}>home</button>
          <button onClick={kick}>kick</button>
          <button onClick={givePermission}>oper</button>
          <button
            style={{ width: "70%", marginTop: "5%" }}
            onClick={() => {
              setChatConfigure("setting");
              openModal();
            }}
          >
            chat setting
          </button>
          <button
            style={{ width: "70%", marginTop: "5%" }}
            onClick={() => {
              setChatConfigure("create");
              openModal();
            }}
          >
            create chat
          </button>
        </div>
        {isModalOpen && (
          <div className="chat-set-modal">
            <Modal
              closeModal={closeModal}
              ConfigureModal={() =>
                chatConfigure === "setting" ? <ChatSetting /> : <CreateChat />
              }
            />
          </div>
        )}
      </div>
    </>
  );
}
