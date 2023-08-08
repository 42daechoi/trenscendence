import ProfileModal from "./ProfileModal";

export default function Friends_list() {
  return (
    <div>
      <li>
        <a className="chat_btn">
          <div>🟢</div>
          <ProfileModal name="daechoi" currUser="other"></ProfileModal>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔴</div>
          <ProfileModal name="youhan" currUser="other"></ProfileModal>
        </a>
      </li>
      <li>
        <a className="chat_btn">
          <div>🔴</div>
          <ProfileModal name="gyyu" currUser="other"></ProfileModal>
        </a>
      </li>
    </div>
  );
}
