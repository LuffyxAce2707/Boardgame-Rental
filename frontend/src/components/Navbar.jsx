import { Link } from 'react-router-dom';

const Navbar = () => {

  return (
    <nav className="navbar">

      <h2>Boardgame Rental</h2>

      <div>
        <Link to="/">Home</Link>

        <Link to="/rentals">Rentals</Link>

        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
