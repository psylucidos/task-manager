import { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import '../css/auth.css';

function Auth() {
  const [mode, setMode] = useState('login');

  function changeMode() {
    if(mode === 'login') {
      setMode('register');
    } else {
      setMode('login');
    }
  }

  return (
    <div className="Auth">
      <div className="Auth-container">
        <h3>Auth</h3>
        { mode === 'login' ? (<Login />) :(<Register />) }
        <button onClick={changeMode}>Mode</button>
      </div>
    </div>
  );
}

export default Auth;
