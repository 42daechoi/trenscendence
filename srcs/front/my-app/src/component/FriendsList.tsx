import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Profile from "./Profile";
import { getFriendList, getWhoami } from "../utils/ApiRequest";

const initFriends: string[] = ["daechoi", "youhan", "gyyu"];
type friendMap = {
  nickname: string;
  id: number;
};

export default function Friends_list() {
  const [friendList, setFriendList] = useState<friendMap[]>([]);
  const [id, setId] = useState(0);

  function init() {
    getWhoami().then((myid) => {
      getFriendList(myid.data.id).then((friends) => {
        for (let i = 0; i < friends.data.length; i++) {
          const friend: friendMap = {
            nickname: friends.data[i].nickname,
            id: friends.data[i].id,
          };
          setFriendList([...friendList, friend]);
        }
      });
    });
  }

  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = (id: number): void => {
    setId(id);
    setModalOpen(true);
  };
  const closeModal = (): void => {
    setModalOpen(false);
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      {friendList.map((friend) => (
        <li key={"friendList"}>
          <a className="chat_btn" onClick={() => openModal(friend.id)}>
            {/* 온라인 오프라인지 아직 db에 없기때문에 임의로 지정 */}
            <div>{friend.id / 2 ? "🔴" : "🟢"}</div>
            <div>{friend.nickname}</div>
          </a>
        </li>
      ))}
      {isModalOpen && (
        <Modal
          closeModal={closeModal}
          ConfigureModal={() => <Profile currUser={id} />}
        />
      )}
    </div>
  );
}
