import React, { useState } from "react";
import Modal from "./Modal";
import Profile from "./Profile";

const initFriends: string[] = ["daechoi", "youhan", "gyyu"];

export default function Friends_list() {
  const [friendList, setFriendList] = useState<string[]>(initFriends);
  // const [friendList, setFriendList] = useState<string[]>([]);

  function addFriendList(channelName: string) {
    setFriendList([...friendList, channelName]);
  }
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = (): void => {
    setModalOpen(true);
  };

  const closeModal = (): void => {
    setModalOpen(false);
  };
  return (
    <div>
      <button
        onClick={() => {
          addFriendList("ma");
        }}
      >
        AddFriend
      </button>
      {friendList.map((friend, index) => (
        <li key={"friendList" + index}>
          <a className="chat_btn">
            <div>{index / 2 ? "🔴" : "🟢"}</div>
            <div onClick={openModal}>{friendList[index]}</div>
          </a>
        </li>
      ))}
      {isModalOpen && (
        <Modal
          closeModal={closeModal}
          ConfigureModal={() => <Profile currUser={"other"} />}
        />
      )}
    </div>
  );
}
