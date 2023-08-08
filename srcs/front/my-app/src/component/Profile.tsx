import React, { useState } from "react";
import "../css/Profile.css";

interface ProfileNode {
  currUser: string;
}

const mAM: string = "modifyAvatarModal";
const mNM: string = "modifyNicknameModal";
const aFM: string = "addFriendModal";
const iGM: string = "inviteGameModal";

function ModifyModalButton(props: { modalType: string }) {
  return (
    <button
      onClick={() => {
        if (props.modalType === mAM) window[mAM].showModal();
        else if (props.modalType === mNM) window[mNM].showModal();
        else if (props.modalType === aFM) window[aFM].showModal();
        else if (props.modalType === iGM) window[iGM].showModal();
      }}
      className="btn-fix glass"
    >
      {props.modalType === mAM
        ? "아바타 수정"
        : props.modalType === mNM
        ? "닉네임 수정"
        : props.modalType === aFM
        ? "친구 추가"
        : props.modalType === iGM
        ? "게임 초대"
        : "기본 텍스트"}
    </button>
  );
}

function ModalWindow(props: { modalType: string }) {
  if (props.modalType === mAM)
    return (
      <dialog id={mAM} className="modal">
        <form method="dialog" className="modal-box">
          <ModifyAvatarSetting />
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  else if (props.modalType === mNM)
    return (
      <dialog id={mNM} className="modal">
        <form method="dialog" className="modal-box">
          <ModifyNicknameSetting />
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  else if (props.modalType === aFM)
    return (
      <dialog id={aFM} className="modal">
        <form method="dialog" className="modal-box">
          <AddFriendSetting num={1} />
        </form>
        <form method="dialog" className="modal-backdrop">
          {/* close의 용도? */}
          <button>close</button>
        </form>
      </dialog>
    );
  else if (props.modalType === iGM)
    return (
      <dialog id={iGM} className="modal">
        <form method="dialog" className="modal-box">
          <InviteGameSetting num={1} />
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
}

function AddFriendSetting(props: { num: number }) {
  // console.log(aFM);
  return <div>AddFriend</div>;
}

function InviteGameSetting(props: { num: number }) {
  // console.log(iGM);
  return <div>InviteGame</div>;
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
            <ModifyModalButton modalType={pn.currUser === "me" ? mAM : aFM} />
            <ModalWindow modalType={pn.currUser === "me" ? mAM : aFM} />
          </div>
          <div className="modal-nickname">
            <ModifyModalButton modalType={pn.currUser === "me" ? mNM : iGM} />
            <ModalWindow modalType={pn.currUser === "me" ? mNM : iGM} />
          </div>
        </div>
      </div>
      <div className="nickname-history-div">
        <div className="history">
          <ul>
            <li>daechoi vs king 2:1 win</li>
            <li>eunji vs hello 1:2 lose</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
