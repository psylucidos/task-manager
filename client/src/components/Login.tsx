import { useState } from 'react';
import type { RootState } from '../app/store';
import { useSelector, useDispatch } from 'react-redux';
import { setID, setToken, setUsername } from '../app/authslice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const id = useSelector((state: RootState) => state.auth.id)
  const token = useSelector((state: RootState) => state.auth.token)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function formSubmit(e: any) {
    e.preventDefault();
    console.log(email, password);
    axios
      .post('http://localhost:3001/auth/login', {
        email,
        password
      })
      .then((res) => {
        console.log(res);
        const { data } = res;
        dispatch(setToken(data.access_token));
        dispatch(setID(data.id));
        dispatch(setUsername(data.username));
        navigate('/tasks');
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div className="Login">
      <h3>Login</h3>
      <form onSubmit={formSubmit}>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default Login;
