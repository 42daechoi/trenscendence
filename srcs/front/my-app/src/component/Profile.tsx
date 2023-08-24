import React, { useEffect, useRef, useState } from "react";
import "../css/Profile.css";
import axios from "axios";
import "../css/Profile.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  apiRequest,
  getWhoami,
  getIntraId,
  patchId,
  modifyNickname,
  getFriendList,
  getId,
} from "../utils/ApiRequest";
interface ProfileNode {
  currUser: number;
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
          props.callback("false");
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
          <FriendButtonSetting num={1} />
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

function FriendButtonSetting(props: { num: number }) {
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
  const textbox = useRef(null);
  const handleFileUpload = () => {
    if (textbox.current.value) {
      {
        if (textbox.current.value.search(/\W|\s/g) > -1) {
          alert("닉네임은 영문과 숫자만 가능합니다!!");
          return;
        }
        modifyNickname(textbox.current.value);
        textbox.current.value = "";
      }
    } else alert("닉네임을 수정하지 못했습니다!");
  };
  return (
    <>
      <h3 className="font-bold text-lg">닉네임 수정</h3>
      <input type="text" ref={textbox} />
      <button className="avatar-upload" onClick={handleFileUpload}>
        수정하기
      </button>
    </>
  );
}

type profileInfo = {
  id: number;
  nickname: string;
  avatar: string;
  rank: string;
  isMyProfile: boolean;
};
const info: profileInfo = {
  id: -1,
  nickname: "unknown",
  avatar: "unknown",
  rank: "unknown",
  isMyProfile: false,
};
export default function Profile(pn: ProfileNode) {
  const [tmpInfo, setInfo] = useState<profileInfo>({
    id: -1,
    nickname: "unknown",
    avatar: "unknown",
    rank: "unknown",
    isMyProfile: false,
  });
  function LoadUserInfo() {
    useEffect(() => {
      getWhoami().then((response) => {
        if (pn.currUser === response.data.id) {
          if (!response.data.twoFA) setTwoFA("false");
          else setTwoFA("true");
          if (tmpInfo.nickname !== response.data.nickname)
            info.nickname = response.data.nickname;
          if (tmpInfo.rank !== response.data.rank)
            info.rank = response.data.rank;
          info.isMyProfile = true;
          setInfo(info);
        } else {
          getId(String(pn.currUser)).then((response) => {
            if (tmpInfo.nickname !== response.data.nickname)
              info.nickname = response.data.nickname;
            if (tmpInfo.rank !== response.data.rank)
              info.rank = response.data.rank;
            info.isMyProfile = false;
            setInfo(info);
          });
        }
      });
      return () => {
        getWhoami().then((response) => {
          info.nickname = response.data.nickname;
          info.rank = response.data.rank;
          info.id = response.data.id;
          info.isMyProfile = true;
        });
      };
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
          {info.nickname}
          <h1 style={{ fontSize: "20px", paddingTop: "10px" }}>
            Rank : {info.rank}
          </h1>
        </div>
        <div className="fix-profile">
          <div className="modal-avatar">
            <ModifyModalButton
              modalType={info.isMyProfile ? mAM : aFM}
              callback={changeTwoFA}
            />
            <ModalWindow modalType={info.isMyProfile ? mAM : aFM} />
          </div>
          <div className="modal-nickname">
            <ModifyModalButton
              modalType={info.isMyProfile ? mNM : iGM}
              callback={changeTwoFA}
            />
            <ModalWindow modalType={info.isMyProfile ? mNM : iGM} />
          </div>
          {info.isMyProfile && (
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
