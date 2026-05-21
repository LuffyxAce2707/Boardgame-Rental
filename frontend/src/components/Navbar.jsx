import { useContext } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

const Navbar = () => {

  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">

      <h2>Boardgame Rental</h2>

      <div>
        <Link to="/">Home</Link>

        <Link to="/rentals/history">Rentals</Link>

        {(user?.role === 'admin' || user?.role === 'staff') && (
          <Link to="/admin">Admin</Link>
        )}

        {user ? (
          <>
            <span style={{ margin: '0 12px' }}>
              {user.fullName} ({user.role})
            </span>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
