import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BoardgameDetails from './pages/BoardgameDetails';
import Rentals from './pages/Rentals';
import AdminDashboard from './pages/AdminDashboard';
import RentalHistory from './pages/RentalHistory';

function App() {

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/boardgames/:id" element={<BoardgameDetails />} />

        <Route path="/rentals" element={<Rentals />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/rentals" element={<RentalHistory />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
