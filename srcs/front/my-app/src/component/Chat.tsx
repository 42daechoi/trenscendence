import React, {
  useState,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useRef,
} from "react";
import { useSocket } from "../component/SocketContext";
import ProfileModal from "../component/ProfileModal";
import Modal from "../component/Modal";
import { whoami } from "../utils/whoami";
import "../css/Chat.css";
import { where } from "../utils/where";
import axios from "axios";
import CreateChat from "./CreateChat";
import SettingChat from "./SettingChat";

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
    user: { name: "SERVER", profile: null, id: 1, isChecked: false },
    sender: "chat chat-start",
    text: "Home 채팅방에 입장하셨습니다.",
    time: new Date().toLocaleTimeString(),
  },
];

function Chat(props) {
  const [users, setUsers] = useState<IUsers[]>([]);
  const [messages, setMessages] = useState<IMessage[]>(initTmpMessages);
  const socket = useSocket();
  console.log(socket);
  const inputRef = useRef<HTMLInputElement>(null);
  // const [users, setUsers] = useState<IUsers[]>([]);
  // const [messages, setMessages] = useState<IMessage[]>([]);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const init = async () => {
    const data = await whoami();
    socket.emit("bind", data.id);
    receiveMessage();
  };

  const receiveMessage = () => {
    socket.on("chat", (receiveData) => {
      if (!receiveData) return;
      axios
        .get("http://localhost:3001/users/" + receiveData.id, {
          withCredentials: true,
        })
        .then((response) => {
          if (!response.data) return;
          addMessage(
            {
              name: response.data.nickname,
              profile: response.data.avatar,
              id: response.data.id,
              isChecked: false,
            },
            receiveData.msg,
            "chat chat-start"
          );
        });
    })
  };

  useEffect(() => {
    init();
    console.log(socket);
    socket.on("op", (data) => {
      if (data.flag) {
        setMessages([]);
        addMessage(
          {
            name: "SERVER",
            profile: null,
            id: 0,
            isChecked: false,
          },
          '채팅방 관리자 권한을 부여 받으셨습니다.',
          "chat chat-start"
        );
      }
    });
    socket.on("kick", (data) => {
      if (data.flag) {
        setMessages([]);
        addMessage(
          {
            name: "SERVER",
            profile: null,
            id: 0,
            isChecked: false,
          },
          '채널에서 강제 퇴장 당하셨습니다.',
          "chat chat-start"
        );
        addMessage(
          {
            name: "SERVER",
            profile: null,
            id: 0,
            isChecked: false,
          },
          "HOME 채널에 참가하셨습니다.",
          "chat chat-start"
        );
      }
    });
    socket.on("join", (channel) => {
      if (channel.flag) initMessages();
    });
    return () => {
      socket.off("chat");
      socket.off("kick");
      socket.off("join");
    };
  }, []);

  const isSameList = () => {
    if (props.memberList.length != users.length) return false;
    for (let i = 0; i < props.memberList.length; i++) {
      if (props.memberList[i] != users[i].id) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const fetchData = async () => {
      const prevUsers = JSON.parse(JSON.stringify(users));
      const newUsers = [];
  
      for (let i = 0; i < props.memberList.length; i++) {
        try {
          const response = await axios.get(
            "http://localhost:3001/users/" + props.memberList[i],
            { withCredentials: true }
          );
          const data = response.data;
          let isAdd = false;
  
          for (let j = 0; j < prevUsers.length; j++) {
            if (prevUsers[j].id === data.id && prevUsers[j].isChecked) {
              newUsers.push({
                name: data.nickname,
                profile: data.avatar,
                id: data.id,
                isChecked: true,
              });
              isAdd = true;
              break;
            }
          }
  
          if (!isAdd) {
            newUsers.push({
              name: data.nickname,
              profile: data.avatar,
              id: data.id,
              isChecked: false,
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
  
      setUsers(newUsers);
    };
  
    if (isSameList()) {
      return;
    }
    fetchData();
  
  }, [props.memberList]);
  

  // useEffect(() => {
  //   const fetchData = async (prevUsers) => {
  //     for (let i = 0; i < props.memberList.length; i++) {
  //       try {
  //         const response = await axios.get(
  //           "http://localhost:3001/users/" + props.memberList[i],
  //           { withCredentials: true }
  //         );
  //         const data = response.data;
  //         let isAdd = false;
  //         for (let j = 0; j < prevUsers.length; j++) {
  //           console.log(prevUsers[j].name, prevUsers[j].isChecked);
  //           if (prevUsers[j].id === data.id && prevUsers[j].isChecked) {
  //             addUsers(data.nickname, data.avatar, data.id, true);
  //             isAdd = true;
  //             break;
  //           }
  //         }
  //         if (!isAdd) addUsers(data.nickname, data.avatar, data.id, false);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   };

  //   if (isSameList()) {
  //     return;
  //   }
  //   const prevUsers = JSON.parse(JSON.stringify(users));
  //   setUsers([]);
  //   fetchData(prevUsers);
  // }, [props.memberList]);


  const addMessage = (user: IUsers, text: string, className: string) => {
    const time = new Date().toLocaleTimeString();
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: user, sender: className, text: text, time: time },
    ]);
  };

  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const chatEnter = async (chat: string) => {
    try {
      const data = await whoami();
      if (chat.substring(0, 6) === "/block ") {
        const target_name: string = chat.substring(6, chat.length);
        socket.emit('mutelistupdate', data.id);
        axios
          .get("http://localhost:3001/users/nickname/" + target_name, {
            withCredentials: true,
          })
          .then((response) => {
            axios
              .patch(
                "http://localhost:3001/users/blocks/add/" + response.data.id,
                null,
                { withCredentials: true }
              )
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
        chat = "";
        return;
      } else if (chat.substring(0, 8) === "/unblock ") {
        socket.emit('mutelistupdate', data.id);
        const target_name: string = chat.substring(8, chat.length);
        axios
          .get("http://localhost:3001/users/nickname/" + target_name, {
            withCredentials: true,
          })
          .then((response) => {
            axios
              .patch(
                "http://localhost:3001/users/blocks/remove/" + response.data.id,
                null,
                { withCredentials: true }
              )
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
        chat = "";
        return;
      } else if (chat.substring(0, 9) === "/blocklist") {
        axios
          .get("http://localhost:3001/users/blocks/list", {
            withCredentials: true,
          })
          .then((response) => {
            if (!response.data.length) {
              console.log("null response");
              return;
            }
            let msg: string = "[";
            let i: number;
            for (i = 0; i < response.data.length - 1; i++) {
              msg += response.data[i].nickname + ", ";
            }
            msg += response.data[i].nickname + "]";
            addMessage(
              {
                name: data.id,
                profile: null,
                id: data.id,
                isChecked: false,
              },
              msg,
              "chat chat-end"
            );
          })
          .catch((error) => {
            console.log(error);
          });
        chat = "";
        return;
      } else if (chat[0] === "/" && chat[1] === "/") {
        const firstSpaceIdx = chat.indexOf(" ");
        const target_name: string = chat.substring(2, firstSpaceIdx);
        const msg: string = chat.substring(firstSpaceIdx + 1, chat.length);

        axios
          .get("http://localhost:3001/users/nickname/" + target_name, {
            withCredentials: true,
          })
          .then((response) => {
            socket.emit("chat", {
              id: data.id,
              target: response.data.id,
              flag: "dm",
              msg: msg,
            });
          });
        addMessage(
          {
            name: data.nickname,
            profile: null,
            id: data.id,
            isChecked: false,
          },
          chat,
          "chat chat-end"
        );
        chat = "";
        return;
      } else if (chat.length) {
        where(socket, data.id)
          .then((channel) => {
            console.log(channel);
            socket.emit("chat", {
              id: data.id,
              target: channel.channelname,
              flag: "broad",
              msg: chat,
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
          chat,
          "chat chat-end"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleButtonClick = async (event: MouseEvent<HTMLButtonElement>) => {
    const target = inputRef.current as HTMLInputElement;
    console.log(target.value);
    event.preventDefault();
    chatEnter(target.value);
    target.value = "";
  };

  const handleKeyPress = async (event: KeyboardEvent<HTMLInputElement>) => {
    // keyCode는 잘 사용되지 않는다고한다. 추후 리팩토링 예정
    if (event.keyCode === 13 && event.key === "Enter" && !event.shiftKey) {
      const target = event.target as HTMLInputElement;
      event.preventDefault();
      console.log(target.value);
      chatEnter(target.value);
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
        if (users[i].isChecked) {
          socket.emit("kick", {
            id: data.id,
            target: users[i].id,
          });
          console.log(users[i].name);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const goHome = async () => {
    try {
      const data = await whoami();
      socket.emit("home", data.id);
      setMessages([]);
      addMessage(
        {
          name: "SERVER",
          profile: null,
          id: 0,
          isChecked: false,
        },
        "Home 채널에 참가하셨습니다.",
        "chat chat-start"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const givePermission = async () => {
    try {
      const data = await whoami();
      for (let i: number = 0; i < users.length; i++) {
        if (users[i].isChecked)
          socket.emit("op", { id: data.id, target: users[i].name });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const initMessages = async () => {
    setMessages([]);
    try {
      const data = await whoami();
      where(socket, data.id)
        .then((channel) => {
          addMessage(
            {
              name: "SERVER",
              profile: null,
              id: 0,
              isChecked: false,
            },
            channel.channelname + " 채널에 참가하셨습니다.",
            "chat chat-start"
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = (): void => {
    setModalOpen(true);
  };

  const closeModal = (): void => {
    setModalOpen(false);
  };
  const [chatConfigure, setChatConfigure] = useState("");



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
          ref={inputRef}
          type="text"
          placeholder="채팅을 입력하세요."
          className="input input-bordered input-accent w-full max-w-xs"
          onKeyDown={handleKeyPress}
        />
        <button
          className="btn btn-active btn-primary"
          onClick={handleButtonClick}
        >
          ↵
        </button>
      </div>
      <div className="chat-member-list">
        <ul>
          {users.map((user, index) => (
            // {/* 추후 key 값을 index 대신 id로 대체 */}
            <li key={"chat" + index}>
              <input
                type="checkbox"
                checked={users[index].isChecked}
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
              setChatConfigure("create");

              openModal();
            }}
          >
            채팅방 생성
          </button>
          <button
            style={{ width: "70%", marginTop: "5%" }}
            onClick={() => {
              setChatConfigure("setting");
              openModal();
            }}
          >
            채팅방 설정
          </button>
        </div>
        {isModalOpen && (
          <div className="chat-set-modal">
            <Modal
              closeModal={closeModal}
              ConfigureModal={() =>
                chatConfigure === "setting" ? (
                  <SettingChat />
                ) : (
                  <CreateChat entryChannel={initMessages} />
                )
              }
            />
          </div>
        )}
      </div>
    </>
  );
}

const MemoChat = React.memo(Chat);

export default MemoChat;