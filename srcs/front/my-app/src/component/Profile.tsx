import React, { useEffect, useState } from "react";
import "../css/Profile.css";
import axios from "axios";
import { apiRequest } from "../utils/ApiRequest";
import "../css/Profile.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { response } from "express";

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
        else if (props.modalType === "false") navigate("/two-factory-auth");
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
          props.callback(false);
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

let userName = "username";
let rank = "rank";
let avatar: string = "avatar";

export default function Profile(pn: ProfileNode) {
  //   const [res, setRes] = useState(null);
  //   function LoadUserInfo() {
  //     useEffect(() => {
  //       // any 대신 타입을 지정하려면 서버에서 보내오는 객체를 알아야될거같다.
  //       // apiRequest<any>("get", "http://localhost:3001/users/whoami").then(
  //       apiRequest<any>(
  //         "get",
  //         "http://localhost:3001/users/intraId/" + pn.currUser
  //       ).then((response) => {
  //         if (userName !== response.data.intraId)
  //           userName = response.data.intraId;
  //         if (rank !== response.data.rank) rank = response.data.rank;
  //         setRes(response);
  //       });
  //     }, []);
  //   }

  //   LoadUserInfo();
  const [twoFA, setTwoFA] = useState("false");
  const changeTwoFA = (s) => {
    setTwoFA(s);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/users/whoami", { withCredentials: true })
      .then((response) => {
        if (!response.data.twoFA) setTwoFA("false");
        else setTwoFA("true");
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
              modalType={pn.currUser === "me" ? mAM : aFM}
              callback={changeTwoFA}
            />
            <ModalWindow modalType={pn.currUser === "me" ? mAM : aFM} />
          </div>
          <div className="modal-nickname">
            <ModifyModalButton
              modalType={pn.currUser === "me" ? mNM : iGM}
              callback={changeTwoFA}
            />
            <ModalWindow modalType={pn.currUser === "me" ? mNM : iGM} />
          </div>
          {pn.currUser === "me" && (
            <div className="2fa">
              <ModifyModalButton modalType={twoFA} callback={changeTwoFA} />
            </div>
          )}
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
      <ToastContainer />
    </div>
  );
}
