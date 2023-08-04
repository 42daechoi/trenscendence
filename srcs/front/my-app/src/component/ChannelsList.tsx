import React, { useRef, useState } from "react";
import Modal from "./Modal";
import "../css/ChannelList.css";

export default function ChannelsList() {
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = (): void => {
    setModalOpen(true);
  };

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
      <li>
        <a className="chat_btn" onClick={openModal}>
          {isModalOpen && (
            <Modal closeModal={closeModal} ConfigureModal={ChannelConfigure} />
          )}
          <div>🔒</div>
          <div>daechoi's chat</div>
          <div className="chat_memeber_count">10/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔓</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔐</div>
          <div>endisnl's chat</div>
          <div className="chat_memeber_count">8/25</div>
        </a>
      </li>
    </div>
  );
}
