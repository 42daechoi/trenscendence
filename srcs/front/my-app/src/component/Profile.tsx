import React, { useState } from "react";
import "../css/Profile.css";
import Modal from "./Modal"

interface ProfileNode {
  currUser: string;
  somefunc(): any;
}

function ModifyModalButton(props: { num: number }) {
  return (
    <button
      onClick={() => {
        if (props.num === 2) window["my_modal_2"].showModal();
        if (props.num === 3) window["my_modal_3"].showModal();
        if (props.num === 4) window["my_modal_4"].showModal();
      }}
      className="btn-fix glass"
    >
      {props.num === 2
        ? "아바타 수정"
        : props.num === 3
        ? "닉네임 수정"
        : props.num === 4
        ? "친구 추가"
        : props.num === 5
        ? "게임 초대"
        : "기본 텍스트"}
    </button>
  );
}

function ModalWindow(props: { num: number }) {
  if (props.num === 2)
    return (
      <dialog id="my_modal_2" className="modal">
        <form method="dialog" className="modal-box">
          <ModifyAvatarSetting />
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  else if (props.num === 3)
    return (
      <dialog id="my_modal_3" className="modal">
        <form method="dialog" className="modal-box">
          <ModifyNicknameSetting />
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
}

function Addfriend(props: { num: number }) {
	//return <Modal></Modal>
}

function InviteGame(props: { num: number }) {
	
}

function ModifyAvatarSetting() {
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleFileUpload = () => {
    if (selectedFile) {
      {
        /*파일 전송*/
      }
      console.log();
    }
  };
  return (
    <>
      <h3 className="font-bold text-lg">아바타 수정</h3>
      <input
        type="file"
        accept=".jpg, .jpeg, .png"
        onChange={handleFileChange}
      />
      <button className="avatar-upload" onClick={handleFileUpload}>
        수정하기
      </button>
    </>
  );
}

function ModifyNicknameSetting() {
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleFileUpload = () => {
    if (selectedFile) {
      {
        /*파일 전송*/
      }
      console.log();
    }
  };
  return (
    <>
      <h3 className="font-bold text-lg">닉네임 수정</h3>
      <input type="text" />
      <button className="avatar-upload" onClick={handleFileUpload}>
        수정하기
      </button>
    </>
  );
}



export default function Profile(pn: ProfileNode) {
  return (
    <div className="my-profile-container">
      <div className="avatar-button-div">
        <div className="avatar-wrapper">
          <img src="/img/img.jpg" alt="" className="avatar-img"></img>
        </div>
        <div className="my-nickname">daechoi</div>
        <div className="fix-profile">
          <div className="modal-avatar">
            <ModifyModalButton num={pn.currUser === "me" ? 2 : 4} />
            <ModalWindow num={pn.currUser === "me" ? 2 : 4} />
          </div>
          <div className="modal-nickname">
            <ModifyModalButton num={pn.currUser === "me" ? 3 : 5} />
            <ModalWindow num={pn.currUser === "me" ? 3 : 5} />
          </div>
        </div>
      </div>
      <div className="nickname-history-div">
        <div className="history">
          <ul>
            <li>daechoi vs king 4:3 win</li>
            <li>eunji vs hello 4:5 lose</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
