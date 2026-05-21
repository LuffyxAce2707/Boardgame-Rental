import { useEffect, useState } from "react";

import API from "../api/axios";

const AdminDashboard = () => {
  const [games, setGames] = useState([]);

  const [rentals, setRentals] = useState([]);

  const [loading, setLoading] = useState(true);

  const [newGame, setNewGame] = useState({
    title: "",
    description: "",
    pricePerDay: "",
  });

  const [image, setImage] = useState(null);

  const fetchDashboardData = async () => {
    const gameResponse = await API.get('/boardgames');
    const rentalResponse = await API.get('/rentals');

    return {
      games: gameResponse.data.data,
      rentals: rentalResponse.data.data,
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

      formData.append("pricePerDay", newGame.pricePerDay);

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
        pricePerDay: "",
      });

      setImage(null);

      await refreshDashboard();
    } catch (error) {
      console.error(error);

      alert("Create failed");
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
          placeholder="Price Per Day"
          value={newGame.pricePerDay}
          onChange={(e) =>
            setNewGame({
              ...newGame,
              pricePerDay: e.target.value,
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
