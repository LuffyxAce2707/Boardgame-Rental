import { useContext, useMemo, useState } from 'react';

import { Navigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

import { checkoutRentals } from '../services/rental.service';

const loadCart = () => JSON.parse(localStorage.getItem('rentalCart')) || [];

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(loadCart);
  const [days, setDays] = useState(3);
  const [paymentMethod, setPaymentMethod] = useState('Demo Payment');
  const [checkingOut, setCheckingOut] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const saveCart = (nextCart) => {
    setCart(nextCart);
    localStorage.setItem('rentalCart', JSON.stringify(nextCart));
    window.dispatchEvent(new Event('rental-cart-updated'));
  };

  const updateQuantity = (gameId, quantity) => {
    const nextCart = cart.map((item) =>
      item._id === gameId
        ? {
            ...item,
            quantity: Math.min(
              Math.max(Number(quantity) || 1, 1),
              item.availableQuantity || 1
            )
          }
        : item
    );

    saveCart(nextCart);
  };

  const removeItem = (gameId) => {
    saveCart(cart.filter((item) => item._id !== gameId));
  };

  const totals = useMemo(() => {
    const rentalTotal = cart.reduce(
      (sum, item) => sum + (item.rentalPrice || 0) * item.quantity * days,
      0
    );
    const depositTotal = cart.reduce(
      (sum, item) => sum + (item.rentalPrice || 0) * item.quantity * 2,
      0
    );

    return {
      rentalTotal,
      depositTotal,
      amountDue: rentalTotal + depositTotal
    };
  }, [cart, days]);

  const handleCheckout = async (event) => {
    event.preventDefault();
    setCheckingOut(true);

    try {
      const response = await checkoutRentals({
        days,
        paymentMethod,
        items: cart.map((item) => ({
          gameId: item._id,
          quantity: item.quantity
        }))
      });

      setReceipt(response.data);
      saveCart([]);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'Checkout failed'
      );
    } finally {
      setCheckingOut(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container">
      <h1>Checkout</h1>

      {receipt && (
        <div className="panel">
          <h2>Payment Complete</h2>
          <p>Checkout ID: {receipt.checkoutId}</p>
          <p>Paid: ${receipt.amountPaid}</p>
          <p>Status: {receipt.paymentStatus}</p>
        </div>
      )}

      {cart.length === 0 ? (
        <p>Your checkout is empty.</p>
      ) : (
        <form onSubmit={handleCheckout} className="checkout-layout">
          <div>
            {cart.map((item) => (
              <div key={item._id} className="checkout-item">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.title} />
                )}

                <div>
                  <h3>{item.title}</h3>
                  <p>${item.rentalPrice} per day</p>
                  <p>Available: {item.availableQuantity}</p>
                </div>

                <input
                  type="number"
                  min="1"
                  max={item.availableQuantity || 1}
                  value={item.quantity}
                  onChange={(event) =>
                    updateQuantity(item._id, event.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <aside className="panel">
            <h2>Payment</h2>

            <label>
              Rental days
              <input
                type="number"
                min="1"
                value={days}
                onChange={(event) => setDays(Number(event.target.value) || 1)}
              />
            </label>

            <label>
              Payment method
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
              >
                <option>Demo Payment</option>
                <option>Cash</option>
                <option>Card</option>
                <option>Bank Transfer</option>
              </select>
            </label>

            <p>Rental: ${totals.rentalTotal}</p>
            <p>Deposit: ${totals.depositTotal}</p>
            <h3>Total due: ${totals.amountDue}</h3>

            <button type="submit" disabled={checkingOut}>
              {checkingOut ? 'Processing...' : 'Pay and Rent'}
            </button>
          </aside>
        </form>
      )}
    </div>
  );
};

export default Checkout;
