

import "../css/LoginPage.css";
import { getWhoami } from "../utils/ApiRequest";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  const navigate = useNavigate();
  const login42 = () => {
  getWhoami()
      .then((result) => {
        if (result.data.status === 1)
          navigate("/main");
        else 
          navigate("/");
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

