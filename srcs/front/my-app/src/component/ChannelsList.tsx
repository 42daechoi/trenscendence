import React, { useState } from "react";
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
    return (
      <>
        <h2>daechoi's chat</h2>
        <h3>daechoi's chat</h3>
        <p>asdfasdfsdsfdas</p>
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
