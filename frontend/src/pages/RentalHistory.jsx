import { useEffect, useMemo, useState } from 'react';

import {
  extendRental,
  getRentalHistory,
  reviewRental,
  returnGame
} from '../services/rental.service';

const RentalHistory = () => {

  const [rentals, setRentals] = useState([]);
  const [extensionDays, setExtensionDays] = useState({});
  const [reviews, setReviews] = useState({});

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

  const handleExtend = async (id) => {
    const days = Number(extensionDays[id]) || 0;

    try {
      await extendRental(id, days);

      const rentalsData = await fetchRentals();
      setRentals(rentalsData);
      setExtensionDays({
        ...extensionDays,
        [id]: ''
      });
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'Extend rental failed'
      );
    }
  };

  const updateReview = (id, field, value) => {
    setReviews((currentReviews) => ({
      ...currentReviews,
      [id]: {
        rating: currentReviews[id]?.rating || '5',
        reviewText: currentReviews[id]?.reviewText || '',
        [field]: value
      }
    }));
  };

  const handleReview = async (id) => {
    const review = reviews[id] || {};

    try {
      await reviewRental(id, {
        rating: review.rating || 5,
        reviewText: review.reviewText || ''
      });

      const rentalsData = await fetchRentals();
      setRentals(rentalsData);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'Save review failed'
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
                    <p>Paid: ${rental.amountPaid || 0}</p>
                  </div>

                  {!rental.returnDate && rental.status !== 'Returned' ? (
                    <div className="rental-actions">
                      <label>
                        Extend days
                        <input
                          type="number"
                          min="1"
                          value={extensionDays[rental._id] || ''}
                          onChange={(event) =>
                            setExtensionDays({
                              ...extensionDays,
                              [rental._id]: event.target.value
                            })
                          }
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleExtend(rental._id)}
                      >
                        Extend
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReturn(rental._id)}
                      >
                        Return Game
                      </button>
                    </div>
                  ) : (
                    <div className="review-box">
                      <span>Returned</span>
                      {rental.rating ? (
                        <div>
                          <p>Rating: {rental.rating}/5</p>
                          <p>{rental.reviewText || 'No review text.'}</p>
                        </div>
                      ) : (
                        <>
                          <label>
                            Rating
                            <select
                              value={reviews[rental._id]?.rating || '5'}
                              onChange={(event) =>
                                updateReview(
                                  rental._id,
                                  'rating',
                                  event.target.value
                                )
                              }
                            >
                              <option value="5">5</option>
                              <option value="4">4</option>
                              <option value="3">3</option>
                              <option value="2">2</option>
                              <option value="1">1</option>
                            </select>
                          </label>
                          <textarea
                            placeholder="Write a review after playing"
                            value={reviews[rental._id]?.reviewText || ''}
                            onChange={(event) =>
                              updateReview(
                                rental._id,
                                'reviewText',
                                event.target.value
                              )
                            }
                          />
                          <button
                            type="button"
                            onClick={() => handleReview(rental._id)}
                          >
                            Save Review
                          </button>
                        </>
                      )}
                    </div>
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
