import "../css/LoginPage.css";

function LoginPage() {
  const login42 = () => {
    window.location.href =
      "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-76960aa574ff1a4710fe07b02dffe9b5d3bb691f66581a2e6d1a0f72cc591b56&redirect_uri=http%3A%2F%2F10.14.9.3%3A3001%2Fauth%2Floginfortytwo%2Fcallback&response_type=code";
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
