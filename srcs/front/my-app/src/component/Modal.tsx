import { useContext, useEffect, useState } from "react";
import "../css/Modal.css";
import { useCurPage, CurPageContext } from "./SocketContext";
// closeModal = Functions required to close modal window
// ConfigureModal = Functions required to decorate modal window
export default function Modal({

  closeModal,
  ConfigureModal,
  children,
}: {
  closeModal: () => void;
  ConfigureModal: () => JSX.Element;
  children?: JSX.Element | JSX.Element[];
}) {


  const {match} = useContext(CurPageContext);
  useEffect(()=>{
  if (match === "match" || match === "accept")
  {
    closeModal();
  }},[match]);


  const stopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };
  const close = (event: React.MouseEvent) => {
    event.stopPropagation();
    closeModal();
  };

  return (
    <>
      <div
        className="modal-overlay"
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          right: "0%",
          top: "0%",
          zIndex: "1000",
          // 배경을 투명하게 한다. 이미 모달을 연상태에서는 배경이 더진해진다
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
        onClick={close}
      >
        <div className="profile-modal" onClick={stopPropagation}>
          {ConfigureModal()}
          <button className="close" onClick={close}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}
