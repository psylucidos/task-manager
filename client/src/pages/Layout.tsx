import { Outlet, Link } from "react-router-dom";
import type { RootState } from '../app/store';
import { useSelector } from 'react-redux';
import '../css/layout.css';

const Layout = () => {
  const id = useSelector((state: RootState) => state.auth.id);
  
  return (
    <>
      <nav className="Layout-nav">
        <h1 className="nav-title">Task-Manager</h1>
        <Link to="/auth">
          <button className="auth-btn">{ id ? 'Sign Out' : 'Login' }</button>
        </Link>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;
