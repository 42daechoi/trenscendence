import React, { useState } from "react";
import "../css/Modal.css";
import MyProfile from "./MyProfile";

type ProfileModalProps = {
  name: string;
};

const Modal = ({ closeModal }) => {
  const stopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };
  return (
    <>
      <div
        className="modal-overlay"
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          right: "0%",
          top: "0%",
          zIndex: "999",
          // 배경을 투명하게 한다. 이미 모달을 연상태에서는 배경이 더진해진다
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
        onClick={closeModal}
      >
        <div className="profile-modal" onClick={stopPropagation}>
          <MyProfile></MyProfile>
          <button className="close" onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default function ProfileModal({ name }: ProfileModalProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = (): void => {
    setModalOpen(true);
  };

  const closeModal = (): void => {
    setModalOpen(false);
  };

  return (
    <div>
      <div onClick={openModal}>{name}</div>
      {isModalOpen && <Modal closeModal={closeModal} />}
    </div>
  );
}
