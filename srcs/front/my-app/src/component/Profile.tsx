import React, { useEffect, useRef, useState } from "react";
import "../css/Profile.css";
import axios from "axios";
import {
  apiRequest,
  getWhoami,
  getIntraId,
  patchId,
} from "../utils/ApiRequest";
import "../css/Profile.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProfileNode {
  currUser: string;
}

const mAM: string = "modifyAvatarModal";
const mNM: string = "modifyNicknameModal";
const aFM: string = "addFriendModal";
const iGM: string = "inviteGameModal";

function ModifyModalButton(props: { modalType: string; callback }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        if (props.modalType === mAM) window[mAM].showModal();
        else if (props.modalType === mNM) window[mNM].showModal();
        else if (props.modalType === aFM) window[aFM].showModal();
        else if (props.modalType === iGM) window[iGM].showModal();
        else if (props.modalType === "false") navigate("/full-tfa");
        else if (props.modalType === "true") {
          axios.post("http://localhost:3001/2fa/disable", null, {
            withCredentials: true,
          });
          toast.error("OTP가 비활성화 되었습니다.", {
            position: toast.POSITION.TOP_LEFT,
            style: {
              width: "500px",
              height: "100px",
              fontSize: "30px",
            },
            autoClose: 1500,
          });
          props.callback('false');
        }
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
        : props.modalType === "true"
        ? "OTP 해제"
        : "OTP 설정"}
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
  const image = useRef(null);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleFileUpload = () => {
    if (image.current.value) {
      {
        /*파일 전송*/
        apiRequest<any>(
          "post",
          "http://localhost:3001/users/modifyAvatar/" + image.current.value
          // 이미지를 어떻게 받을지에 따라 수정
        )
          .then((response) => {})
          .catch((error) => {});
      }
    }
  };
  return (
    <>
      <h3 className="font-bold text-lg">아바타 수정</h3>
      <input
        type="file"
        accept=".jpg, .jpeg, .png"
        onChange={handleFileChange}
        ref={image}
      />
      <button className="avatar-upload" onClick={handleFileUpload}>
        수정하기
      </button>
    </>
  );
}

function ModifyNicknameSetting() {
  const [selectedFile, setSelectedFile] = useState(null);
  const text = useRef(null);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleFileUpload = () => {
    patchId("1");
    if (text.current.value) {
      {
        /*파일 전송*/
        apiRequest(
          "post",
          "http://localhost:3001/users/modifyNickname/" + text.current.value
        )
          .then((response) => {})
          .catch((error) => {});
      }
    }
  };
  return (
    <>
      <h3 className="font-bold text-lg">닉네임 수정</h3>
      <input type="text" ref={text} />
      <button className="avatar-upload" onClick={handleFileUpload}>
        수정하기
      </button>
    </>
  );
}

let userName: string = "username";
let rank: string = "rank";
let avatar: string = "avatar";
let isCurrentUser: string = "";

export default function Profile(pn: ProfileNode) {
  const [res, setRes] = useState(null);
  function LoadUserInfo() {
    useEffect(() => {
      getWhoami().then((response) => {
        if (pn.currUser === response.data.intraId) {
          if (!response.data.twoFA) setTwoFA("false");
          else setTwoFA("true");
          if (userName !== response.data.intraId)
            userName = response.data.intraId;
          if (rank !== response.data.rank) rank = response.data.rank;
          setRes(response);
          isCurrentUser = userName;
        } else {
          getIntraId(pn.currUser).then((response) => {
            if (userName !== response.data.intraId)
              userName = response.data.intraId;
            if (rank !== response.data.rank) rank = response.data.rank;
            setRes(response);
          });
        }
      });
    }, []);
  }

  const [twoFA, setTwoFA] = useState("false");
  const changeTwoFA = (s) => {
    setTwoFA(s);
  };

  LoadUserInfo();
  return (
    <div className="my-profile-container">
      <div className="avatar-button-div">
        <div className="avatar-wrapper">
          <img src="/img/img.jpg" alt="" className="avatar-img"></img>
        </div>
        <div className="my-nickname">
          {userName}
          <h1 style={{ fontSize: "20px", paddingTop: "10px" }}>
            Rank : {rank}
          </h1>
        </div>
        <div className="fix-profile">
          <div className="modal-avatar">
            <ModifyModalButton
              modalType={isCurrentUser === userName ? mAM : aFM}
              callback={changeTwoFA}
            />
            <ModalWindow modalType={isCurrentUser === userName ? mAM : aFM} />
          </div>
          <div className="modal-nickname">
            <ModifyModalButton
              modalType={isCurrentUser === userName ? mNM : iGM}
              callback={changeTwoFA}
            />
            <ModalWindow modalType={isCurrentUser === userName ? mNM : iGM} />
          </div>
          {isCurrentUser === userName && (
            <div className="2fa">
              <ModifyModalButton modalType={twoFA} callback={changeTwoFA} />
            </div>
          )}
        </div>
      </div>
      <div className="nickname-history-div">
        <div className="history">
          <ul>
            <li style={{ userSelect: "auto" }}>daechoi vs king 2:1 win</li>
            <li style={{ userSelect: "auto" }}>eunji vs hello 1:2 lose</li>
          </ul>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
