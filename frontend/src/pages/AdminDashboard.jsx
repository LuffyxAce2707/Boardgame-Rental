import { useEffect, useState } from 'react';

import API from '../api/axios';

const AdminDashboard = () => {

  const [games, setGames] = useState([]);

  const [rentals, setRentals] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {

    try {

      const gameResponse = await API.get(
        '/boardgames'
      );

      const rentalResponse = await API.get(
        '/rentals'
      );

      setGames(gameResponse.data.data);

      setRentals(rentalResponse.data.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchData();

  }, []);

  const totalGames = games.length;

  const totalRentals = rentals.length;

  const activeRentals = rentals.filter(
    (rental) =>
      rental.status !== 'Returned'
  ).length;

  const overdueRentals = rentals.filter(
    (rental) =>
      rental.status === 'Late'
  ).length;

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div
      style={{
        padding: '20px'
      }}
    >

      <h1>Admin Dashboard</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}
      >

        <div
          style={{
            border: '1px solid gray',
            padding: '20px',
            borderRadius: '10px'
          }}
        >
          <h2>Total Games</h2>
          <p>{totalGames}</p>
        </div>

        <div
          style={{
            border: '1px solid gray',
            padding: '20px',
            borderRadius: '10px'
          }}
        >
          <h2>Total Rentals</h2>
          <p>{totalRentals}</p>
        </div>

        <div
          style={{
            border: '1px solid gray',
            padding: '20px',
            borderRadius: '10px'
          }}
        >
          <h2>Active Rentals</h2>
          <p>{activeRentals}</p>
        </div>

        <div
          style={{
            border: '1px solid gray',
            padding: '20px',
            borderRadius: '10px'
          }}
        >
          <h2>Overdue Rentals</h2>
          <p>{overdueRentals}</p>
        </div>

      </div>

      <h2>Recent Rentals</h2>

      <table
        border="1"
        cellPadding="10"
        width="100%"
      >

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

              <td>
                {rental.userId?.fullName}
              </td>

              <td>
                {rental.gameId?.title}
              </td>

              <td>
                {rental.status}
              </td>

              <td>
                {
                  new Date(rental.dueDate)
                    .toLocaleDateString()
                }
              </td>

              <td>
                ${rental.fineAmount}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );

};

export default AdminDashboard;