import "../css/LoginPage.css";

const authUrl = process.env.REACT_APP_AUTH_URL;

function LoginPage() {
  const login42 = () => {
    window.location.href = authUrl;
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
