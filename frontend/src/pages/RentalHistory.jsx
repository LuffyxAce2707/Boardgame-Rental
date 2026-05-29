import { useEffect, useMemo, useState } from 'react';

import {
  getRentalHistory,
  returnGame
} from '../services/rental.service';

const RentalHistory = () => {

  const [rentals, setRentals] = useState([]);

  const fetchRentals = async () => {
    const response = await getRentalHistory();
    return response.data;
  };

  useEffect(() => {
    const loadRentals = async () => {
      try {
        const rentalsData = await fetchRentals();
        setRentals(rentalsData);
      } catch (error) {
        console.error(error);
      }
    };

    loadRentals();
  }, []);

  const handleReturn = async (id) => {

    try {

      await returnGame(id);

      const rentalsData = await fetchRentals();
      setRentals(rentalsData);

    } catch (error) {

      console.error(error);
      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'Return failed'
      );

    }

  };

  const rentalOrders = useMemo(() => {
    const ordersById = new Map();

    for (const rental of rentals) {
      const orderId = rental.checkoutId || rental._id;

      if (!ordersById.has(orderId)) {
        ordersById.set(orderId, {
          id: orderId,
          createdAt: rental.createdAt,
          dueDate: rental.dueDate,
          paymentStatus: rental.paymentStatus || 'Pending',
          paymentMethod: rental.paymentMethod || '-',
          rentals: []
        });
      }

      ordersById.get(orderId).rentals.push(rental);
    }

    return Array.from(ordersById.values()).map((order) => {
      const amountPaid = order.rentals.reduce(
        (sum, rental) => sum + (rental.amountPaid || 0),
        0
      );
      const fineAmount = order.rentals.reduce(
        (sum, rental) => sum + (rental.fineAmount || 0),
        0
      );
      const allReturned = order.rentals.every(
        (rental) => rental.returnDate || rental.status === 'Returned'
      );

      return {
        ...order,
        amountPaid,
        fineAmount,
        status: allReturned ? 'Returned' : 'Active'
      };
    });
  }, [rentals]);

  return (
    <div className="container">

      <h1>Rental History</h1>

      {rentalOrders.length === 0 ? (
        <p>No rentals yet.</p>
      ) : (
        rentalOrders.map((order) => (
          <section key={order.id} className="rental-order">
            <div className="rental-order-header">
              <div>
                <h2>Order {order.id}</h2>
                <p>
                  Date:{' '}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : '-'}
                </p>
              </div>

              <div>
                <p>Status: {order.status}</p>
                <p>Payment: {order.paymentStatus}</p>
                <p>Method: {order.paymentMethod}</p>
              </div>

              <div>
                <p>Paid: ${order.amountPaid}</p>
                <p>Late fees: ${order.fineAmount}</p>
              </div>
            </div>

            <div className="rental-order-items">
              {order.rentals.map((rental) => (
                <div key={rental._id} className="rental-order-item">
                  {rental.gameId?.imageUrl && (
                    <img
                      src={rental.gameId.imageUrl}
                      alt={rental.gameId?.title}
                    />
                  )}

                  <div>
                    <h3>{rental.gameId?.title}</h3>
                    <p>Quantity: {rental.quantity}</p>
                    <p>
                      Due Date:{' '}
                      {new Date(rental.dueDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p>Status: {rental.status}</p>
                    <p>Fine: ${rental.fineAmount}</p>
                  </div>

                  {!rental.returnDate && rental.status !== 'Returned' ? (
                    <button
                      type="button"
                      onClick={() => handleReturn(rental._id)}
                    >
                      Return Game
                    </button>
                  ) : (
                    <span>Returned</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))
      )}

    </div>
  );

};

export default RentalHistory;
