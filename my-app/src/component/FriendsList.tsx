import React, { useState } from "react";
import ProfileModal from "./ProfileModal";

export default function Friends_list() {
  return (
    <div>
      <li>
        <a className="chat_btn">
          <div>🟢</div>
          <ProfileModal name="daechoi"></ProfileModal>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔴</div>
          <ProfileModal name="youhan"></ProfileModal>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔴</div>
          <ProfileModal name="gyyu"></ProfileModal>
        </a>
      </li>
    </div>
  );
}
