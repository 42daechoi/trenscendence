import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPage from './page/LoginPage';
import MainPage from './page/MainPage';
import CreateAccPage from './page/CreateAccPage';
import Callback from './page/CallbackPage';
import TwoFactoryAuth from './page/TwoFactoryAuth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={LoginPage}></Route>
        <Route path='/main' Component={MainPage}></Route>
        <Route path='/create-account' Component={CreateAccPage}></Route>
        <Route path='/callback' Component={Callback}></Route>
        <Route path='/two-factory-auth' Component={TwoFactoryAuth}></Route>
      </Routes>
    </Router>
  );
}

export default App;
