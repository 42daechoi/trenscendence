import React, { useState } from "react";
import "../css/Modal.css";

const Modal = ({ closeModal }) => {
  const stopPropagation = (e: any) => {
    e.stopPropagation();
  };
  return (
    // <div className="profile-modal-back" onClick={closeModal}>
    <>
      <div
        className="modal-overlay"
        style={{ position: "fixed", width: "100vw", height: "100vh" }}
        onClick={closeModal}
      ></div>
      <div className="profile-modal" onClick={stopPropagation}>
        <button className="close" onClick={closeModal}>
          Close
        </button>
        <h2>This is a modal</h2>
        <p>Some content...</p>
      </div>
      {/* // </div> */}
    </>
  );
};

export default function Friends_list() {
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <li>
        <a className="chat_btn" onClick={openModal}>
          <div>🟢</div>
          <div>daechoi</div>
        </a>
      </li>
      <li>
        <a className="chat_btn" onClick={openModal}>
          <div>🔴</div>
          <div>endisnl</div>
        </a>
      </li>
      <li>
        <a className="chat_btn" onClick={openModal}>
          <div>🔴</div>
          <div>endisnl</div>
        </a>
      </li>
      {isModalOpen && <Modal closeModal={closeModal} />}
    </div>
  );
}
