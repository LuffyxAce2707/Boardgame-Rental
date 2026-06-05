import { useContext, useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

const Navbar = () => {

  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('rentalCart')) || [];
      setCartCount(
        cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
      );
    };

    updateCartCount();
    window.addEventListener('rental-cart-updated', updateCartCount);

    return () => {
      window.removeEventListener('rental-cart-updated', updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">

      <Link className="brand" to="/">Boardgame Rental</Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/rentals/history">Rentals</Link>

        <Link to="/checkout">Checkout ({cartCount})</Link>

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
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
