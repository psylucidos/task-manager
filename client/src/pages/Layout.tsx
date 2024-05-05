import { Outlet, Link } from "react-router-dom";
import type { RootState } from '../app/store';
import { useSelector, useDispatch } from 'react-redux';
import { setID, setToken, setUsername } from '../app/authslice';
import '../css/layout.css';

const Layout = () => {
  const id = useSelector((state: RootState) => state.auth.id);
  const dispatch = useDispatch();

  function clearAuth() {
    dispatch(setID(''));
    dispatch(setUsername(''));
    dispatch(setToken(''));
  }

  return (
    <>
      <nav className="Layout-nav">
        <h1 className="nav-title">Task-Manager {id}</h1>
        <Link to={ id ? '/' : '/auth' }>
          <button onClick={clearAuth} className="auth-btn">{ id ? 'Sign Out' : 'Login' }</button>
        </Link>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;
