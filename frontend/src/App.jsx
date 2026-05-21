import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BoardgameDetail from './pages/BoardgameDetail';
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

        <Route path="/boardgames/:id" element={<BoardgameDetail />} />

        <Route path="/rentals" element={<Rentals />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/rentals/history" element={<RentalHistory />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
