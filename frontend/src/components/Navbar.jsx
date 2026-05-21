import { useContext } from 'react';

import { Link } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

const Navbar = () => {

  const { user } = useContext(AuthContext);

  return (
    <nav className="navbar">

      <h2>Boardgame Rental</h2>

      <div>
        <Link to="/">Home</Link>

        <Link to="/rentals">Rentals</Link>

        {(user?.role === 'admin' || user?.role === 'staff') && (
          <Link to="/admin">Admin</Link>
        )}

        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
