import { Link, useLocation } from 'react-router-dom';
import '../css/top-bar.css';
import { useEffect } from 'react';
import { useUser } from '@/auth/UserContext';

export default function TopBar() {
  const location = useLocation();
  const { userData, refetchUser } = useUser();

  useEffect(() => {
    refetchUser();
  }, [location]);

  const name = userData ? `${userData.firstName.charAt(0).toUpperCase()}${userData.lastName.charAt(0).toUpperCase()}` : null;
    return (
        <header className="top-bar">
            <Link className="brand" to="/">
                <div className="brand-icon">✿</div>
                <div className="brand-name">Family Moments</div>
            </Link>

            <nav className="nav-links">
                <Link to="/" className="active">Home</Link>
                <Link to="/memories">Albums</Link>
                {userData ? <Link to="/logout">Log out</Link> : <Link to="/login">Log in</Link>}
            </nav>

            {userData && <div className="top-right">
                <button className="avatar">{name}</button>
            </div>}
        </header>
    );
}