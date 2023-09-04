import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Profile from "./Profile";
import { getFriendList, getWhoami } from "../utils/ApiRequest";

type friendMap = {
  nickname: string;
  id: number;
  status: number;
};

export default function Friends_list() {
  const [friendList, setFriendList] = useState<friendMap[]>([]);
  const [id, setId] = useState(0);

  function init() {
    getWhoami().then((myid) => {
      getFriendList(myid.data.id).then((friends) => {
        const newFriendList = [...friendList]; // 기존 배열 복사
        for (let i = 0; i < friends.data.length; i++) {
          newFriendList.push({
            nickname: friends.data[i].nickname,
            id: friends.data[i].id,
            status: friends.data[i].status,
          });
        }
        setFriendList(newFriendList); // 한 번만 호출
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
    const pollingInterval = setInterval(init, 10000);
  }, []);

  return (
    <div>
      {friendList.map((friend) => (
        <li key={"friendList" + friend.id}>
          <a className="chat_btn" onClick={() => openModal(friend.id)}>
            {/* 온라인 오프라인지 아직 db에 없기때문에 임의로 지정 */}
            <div>{friend.status ? "🟢" : "🔴"}</div>
            <div>{friend.nickname}</div>
          </a>
        </li>
      ))}
      {isModalOpen && (
        <Modal
          closeModal={closeModal}
          ConfigureModal={() => <Profile currUser={id} isMe={false} />}
        />
      )}
    </div>
  );
}
