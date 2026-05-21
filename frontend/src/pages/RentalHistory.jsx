import { useEffect, useState } from 'react';

import {
  getRentalHistory,
  returnGame
} from '../services/rental.service';

const RentalHistory = () => {

  const [rentals, setRentals] = useState([]);

  const fetchRentals = async () => {

    try {

      const response = await getRentalHistory();

      setRentals(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleReturn = async (id) => {

    try {

      await returnGame(id);

      fetchRentals();

    } catch (error) {

      console.error(error);

    }

  };

  return (
    <div>

      <h1>Rental History</h1>

      {rentals.map((rental) => (

        <div
          key={rental._id}
          style={{
            border: '1px solid gray',
            padding: '10px',
            marginBottom: '10px'
          }}
        >

          <h3>
            {rental.gameId?.title}
          </h3>

          <p>
            Status: {rental.status}
          </p>

          <p>
            Due Date:
            {' '}
            {new Date(rental.dueDate)
              .toLocaleDateString()}
          </p>

          <p>
            Fine: ${rental.fineAmount}
          </p>

          {
            rental.status !== 'Returned' && (
              <button
                onClick={() =>
                  handleReturn(rental._id)
                }
              >
                Return Game
              </button>
            )
          }

        </div>

      ))}

    </div>
  );

};

export default RentalHistory;