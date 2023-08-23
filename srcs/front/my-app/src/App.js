import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SocketProvider } from './component/SocketContext';
import LoginPage from './page/LoginPage';
import MainPage from './page/MainPage';
import CreateAccPage from './page/CreateAccPage';
import Callback from './page/CallbackPage';
import FullTFA from './page/FullTFA';
import GamePage from "./page/GamePage";
import PartialTFA from "./page/PartialTFA";



function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path='/' Component={LoginPage}></Route>
          <Route path='/main' Component={MainPage}></Route>
          <Route path='/create-account' Component={CreateAccPage}></Route>
          <Route path='/callback' Component={Callback}></Route>
          <Route path="/game" Component={GamePage}></Route>
          <Route path='/full-tfa' Component={FullTFA}></Route>
          <Route path='/partial-tfa' Component={PartialTFA}></Route>
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
