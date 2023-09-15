

import "../css/LoginPage.css";
import { getWhoami } from "../utils/ApiRequest";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../component/SocketContext";
import { useEffect, useState } from "react";
function LoginPage() {
  const navigate = useNavigate();
  const socket = useSocket();
  const [isLogin, setIsLogin] = useState(false);
  useEffect(()=> {
    getWhoami()
      .then((result) => {
        if (result.data.status === 1)
          setIsLogin(true);
        // navigate("/main");
      })
      .catch((err) => {
        return ;
      });
  },[])
  useEffect(() => {if (socket){
    console.log("1");
    if (isLogin === true)
    {
      console.log("2");
      socket.disconnect();
    }
    else
      console.log("3");
  }},[socket, isLogin])
  const login42 = () => {
  getWhoami()
      .then((result) => {
        if (result.data.status === 1)
          setIsLogin(true);
      })
      .catch((err) => {
          window.location.href =
            "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-2ba7bd194c505ff9326db61afa5c8f62b677dd535610878d78076cd0137b36b9&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Floginfortytwo%2Fcallback&response_type=code";
      });
    };
  return (
    <div className="hero min-h-screen bg-base-200">
      <button onClick={login42} className="login">
        LOGIN WITH 42
      </button>
      <div>해당 홈페이지는 PC와 태블릿에 최적화 되어 있습니다.</div>
    </div>
  );
}

export default LoginPage;

