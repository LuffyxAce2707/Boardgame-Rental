import { useContext, useEffect, useState } from "react";

import { Navigate } from "react-router-dom";

import API from "../api/axios";

import { AuthContext } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [games, setGames] = useState([]);

  const [rentals, setRentals] = useState([]);

  const [loading, setLoading] = useState(true);

  const [newGame, setNewGame] = useState({
    title: "",
    description: "",
    rentalPrice: "",
    quantity: "1",
  });

  const [image, setImage] = useState(null);

  const fetchDashboardData = async () => {
    const gameResponse = await API.get('/boardgames', {
      params: { limit: 100 },
    });
    const rentalResponse = await API.get('/rentals');

    return {
      games: gameResponse.data?.data ?? [],
      rentals: rentalResponse.data?.data ?? [],
    };
  };

  const refreshDashboard = async () => {
    try {
      const { games, rentals } = await fetchDashboardData();
      setGames(games);
      setRentals(rentals);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const { games, rentals } = await fetchDashboardData();
        setGames(games);
        setRentals(rentals);
      } catch (error) {
        console.error(error);
        alert(
          error.response?.data?.message ||
            "Failed to load dashboard. Log in as admin or staff."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreateGame = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", newGame.title);

      formData.append("description", newGame.description);

      formData.append("rentalPrice", newGame.rentalPrice);
      formData.append("quantity", newGame.quantity);

      if (image) {
        formData.append("image", image);
      }

      await API.post("/boardgames", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Game created");

      setNewGame({
        title: "",
        description: "",
        rentalPrice: "",
        quantity: "1",
      });

      setImage(null);

      await refreshDashboard();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Create failed"
      );
    }
  };

  const totalGames = games.length;

  const totalRentals = rentals.length;

  const activeRentals = rentals.filter(
    (rental) => rental.status !== "Returned",
  ).length;

  const overdueRentals = rentals.filter(
    (rental) => rental.status === "Late",
  ).length;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin" && user.role !== "staff") {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Admin access required</h2>
        <p>
          Your account role is &quot;{user.role}&quot;. Ask an administrator to
          set your role to admin or staff in the database.
        </p>
      </div>
    );
  }

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <h1>Admin Dashboard</h1>

      <form
        onSubmit={handleCreateGame}
        style={{
          marginBottom: "30px",
          border: "1px solid gray",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h2>Add Boardgame</h2>

        <input
          type="text"
          placeholder="Title"
          value={newGame.title}
          onChange={(e) =>
            setNewGame({
              ...newGame,
              title: e.target.value,
            })
          }
          style={{
            display: "block",
            marginBottom: "10px",
            width: "100%",
            padding: "10px",
          }}
        />

        <textarea
          placeholder="Description"
          value={newGame.description}
          onChange={(e) =>
            setNewGame({
              ...newGame,
              description: e.target.value,
            })
          }
          style={{
            display: "block",
            marginBottom: "10px",
            width: "100%",
            padding: "10px",
          }}
        />

        <input
          type="number"
          placeholder="Rental Price (per day)"
          value={newGame.rentalPrice}
          onChange={(e) =>
            setNewGame({
              ...newGame,
              rentalPrice: e.target.value,
            })
          }
          style={{
            display: "block",
            marginBottom: "10px",
            width: "100%",
            padding: "10px",
          }}
        />

        <input
          type="number"
          min="1"
          placeholder="Quantity"
          value={newGame.quantity}
          onChange={(e) =>
            setNewGame({
              ...newGame,
              quantity: e.target.value,
            })
          }
          style={{
            display: "block",
            marginBottom: "10px",
            width: "100%",
            padding: "10px",
          }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{
            marginBottom: "10px",
          }}
        />

        <button type="submit">Add Game</button>
      </form>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>Total Games</h2>
          <p>{totalGames}</p>
        </div>

        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>Total Rentals</h2>
          <p>{totalRentals}</p>
        </div>

        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>Active Rentals</h2>
          <p>{activeRentals}</p>
        </div>

        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>Overdue Rentals</h2>
          <p>{overdueRentals}</p>
        </div>
      </div>

      <h2>Recent Rentals</h2>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>User</th>

            <th>Game</th>

            <th>Status</th>

            <th>Due Date</th>

            <th>Fine</th>
          </tr>
        </thead>

        <tbody>
          {rentals.map((rental) => (
            <tr key={rental._id}>
              <td>{rental.userId?.fullName}</td>

              <td>{rental.gameId?.title}</td>

              <td>{rental.status}</td>

              <td>{new Date(rental.dueDate).toLocaleDateString()}</td>

              <td>${rental.fineAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
