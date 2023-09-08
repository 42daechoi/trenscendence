import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { SocketProvider, GameSocketProvider, CurPageProvider } from "./component/SocketContext";
import LoginPage from "./page/LoginPage";
import MainPage from "./page/MainPage";
import CreateAccPage from "./page/CreateAccPage";
import Callback from "./page/CallbackPage";
import FullTFA from "./page/FullTFA";
import GamePage from "./page/GamePage";
import PartialTFA from "./page/PartialTFA";
import { getWhoami } from "./utils/ApiRequest";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isSet, setIsSet] = useState(false);
  function ProtectedRoute() {}

  getWhoami()
    .then((result) => {
      setIsSet(true);
      setIsLogin(true);
    })
    .catch((err) => {
      setIsSet(true);
      setIsLogin(false);
    });

  return (
    <GameSocketProvider>
      <SocketProvider>
        <CurPageProvider>
        <Router>
          {isSet && (
            <Routes>
              <Route
                path="/"
                Component={isLogin ? LoginPage : LoginPage}
              ></Route>
              <Route
                path="/main"
                Component={isLogin ? MainPage : LoginPage}
              ></Route>
              <Route
                path="/create-account"
                Component={isLogin ? CreateAccPage : LoginPage}
              ></Route>
              <Route
                path="/callback"
                Component={isLogin ? Callback : LoginPage}
              ></Route>
              <Route
                path="/game"
                Component={isLogin ? GamePage : LoginPage}
              ></Route>
              <Route
                path="/full-tfa"
                Component={isLogin ? FullTFA : LoginPage}
              ></Route>
              <Route
                path="/partial-tfa"
                Component={isLogin ? PartialTFA : LoginPage}
              ></Route>
            </Routes>
          )}
        </Router>
        </CurPageProvider>
      </SocketProvider>
    </GameSocketProvider>
  );
}

export default App;
