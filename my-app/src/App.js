import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPage from './LoginPage';
import MainPage from './MainPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' Component={LoginPage}></Route>
        <Route path='/main' Component={MainPage}></Route>
      </Routes>
    </Router>
  );
}

export default App;
