import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CreateAccPage.css";
import { Buffer } from "buffer";
import axios from "axios";
import { response } from "express";
import {
  modifyNickname,
  getUserByNickname,
  getWhoami,
  modifyAvatar,
} from "../utils/ApiRequest";
import { useRef } from "react";

export default function CreateAccPage() {
  const nickname = useRef(null);
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   if (files && files.length > 0) {
  //     setSelectedFile(files[0]);
  //   }
  // };
  useEffect(() => {
    getWhoami()
      .then((result) => {
        const bufferData: number[] = result.data.profilePicture.data;
        console.log(bufferData);
        const buffer: Buffer = Buffer.from(bufferData);
        setAvatar(buffer.toString("base64"));
      })
      .catch((err) => {});
  }, []);

  const createAccount = () => {
    if (!nickname.current.value) {
      alert("닉네임이 입력되지 않았습니다.");
      return;
    }
    getUserByNickname(nickname.current.value)
      .then((result) => {
        console.log(result.data);
        if (result.data) alert("이미 존재하는 닉네임입니다.");
        else {
          modifyNickname(nickname.current.value, false);
          modifyAvatar(selectedFile);
          navigate("/main");
        }
      })
      .catch((err) => {});
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setSelectedFile(selectedFile);

      const reader = new FileReader();
      reader.onload = function (event) {
        const result = event.target.result;
        if (typeof result === "string") {
          setAvatar(result.split(",")[1]);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="background .my-profile-container">
      <div className="avatar-button-div">
        <div className="account-box">
          <div>
            설정을 하지 않거나 이탈할 경우 기본 닉네임과 아바타로 설정됩니다.
          </div>
          <div>
            닉네임
            <input
              ref={nickname}
              type="text"
              maxLength={13}
              placeholder={"nickname"}
            ></input>
          </div>
          <div
            className="avatar-wrapper"
            style={{
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              transform: "translate(60%)",
            }}
          >
            <img
              src={`data:image/jpeg;base64,${avatar}`}
              alt="avatar"
              className="avatar-img"
            ></img>
          </div>
          <div>
            아바타
            <input
              className="avatar-file"
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={handleFileChange} // 여기를 추가했습니다.
            ></input>
          </div>
          <button onClick={createAccount}>계정 생성</button>
        </div>
      </div>
    </div>
  );
}
