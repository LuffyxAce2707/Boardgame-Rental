import { useContext, useMemo, useState } from 'react';

import { Navigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

import { checkoutRentals } from '../services/rental.service';

const loadCart = () => JSON.parse(localStorage.getItem('rentalCart')) || [];

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(loadCart);
  const [days, setDays] = useState(3);
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [checkingOut, setCheckingOut] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [cardStep, setCardStep] = useState('info');
  const [cardError, setCardError] = useState('');
  const [otp, setOtp] = useState('');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

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

    if (paymentMethod === 'Card' && cardStep === 'info') {
      const hasMissingCardInfo = Object.values(cardInfo).some(
        (value) => !value.trim()
      );

      if (hasMissingCardInfo) {
        setCardError('Please complete all card fields.');
        return;
      }

      setCardError('');
      setCardStep('otp');
      return;
    }

    if (paymentMethod === 'Card' && cardStep === 'otp' && otp !== '123456') {
      setCardError('Payment failed: wrong OTP. Use 123456 for this demo.');
      setCardStep('failed');
      return;
    }

    if (paymentMethod === 'Card' && cardStep === 'failed') {
      return;
    }

    setCheckingOut(true);
    setCardError('');

    try {
      if (paymentMethod === 'Card') {
        setCardStep('processing');
        await new Promise((resolve) => {
          setTimeout(resolve, 1200);
        });
      }

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
      setCardStep('success');
    } catch (error) {
      console.error(error);
      setCardStep(paymentMethod === 'Card' ? 'failed' : cardStep);
      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'Checkout failed'
      );
    } finally {
      setCheckingOut(false);
    }
  };

  const changePaymentMethod = (method) => {
    setPaymentMethod(method);
    setCardStep('info');
    setCardError('');
    setOtp('');
    setReceipt(null);
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container">
      <h1>Checkout</h1>

      {receipt && (
        <div className="panel">
          <h2>Payment Successful</h2>
          <p>Checkout ID: {receipt.checkoutId}</p>
          <p>Paid: ${receipt.amountPaid}</p>
          <p>Status: {receipt.paymentStatus}</p>
          <p>Delivery timeline: ready for pickup after staff confirmation.</p>
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
                onChange={(event) => changePaymentMethod(event.target.value)}
              >
                <option>Bank Transfer</option>
                <option>Card</option>
              </select>
            </label>

            {paymentMethod === 'Bank Transfer' && (
              <div className="bank-transfer-box">
                <img
                  className="bank-transfer-qr"
                  src="/bank-transfer-qr.jpg"
                  alt="Bank transfer QR code"
                />
                <p>Scan this QR code in your banking app.</p>
                <p>Payment confirmation appears after checkout is received.</p>
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="card-payment-box">
                {cardStep === 'info' && (
                  <>
                    <h3>Secure Card Form</h3>
                    <div className="hosted-card-frame">
                      <input
                        type="text"
                        placeholder="Card Number"
                        value={cardInfo.number}
                        onChange={(event) =>
                          setCardInfo({
                            ...cardInfo,
                            number: event.target.value
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={cardInfo.name}
                        onChange={(event) =>
                          setCardInfo({
                            ...cardInfo,
                            name: event.target.value
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardInfo.expiry}
                        onChange={(event) =>
                          setCardInfo({
                            ...cardInfo,
                            expiry: event.target.value
                          })
                        }
                      />
                      <input
                        type="password"
                        placeholder="CVV/CVC"
                        value={cardInfo.cvc}
                        onChange={(event) =>
                          setCardInfo({
                            ...cardInfo,
                            cvc: event.target.value
                          })
                        }
                      />
                    </div>
                  </>
                )}

                {cardStep === 'otp' && (
                  <label>
                    3D Secure OTP
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(event) => setOtp(event.target.value)}
                    />
                  </label>
                )}

                {cardStep === 'processing' && (
                  <div className="processing-payment">
                    <div className="spinner" />
                    <p>
                      Processing payment... Please do not refresh or close the
                      browser
                    </p>
                  </div>
                )}

                {cardStep === 'failed' && (
                  <div className="payment-failed">
                    <p>{cardError || 'Payment failed.'}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setCardStep('info');
                        setCardError('');
                      }}
                    >
                      Try another card
                    </button>
                    <button
                      type="button"
                      onClick={() => changePaymentMethod('Bank Transfer')}
                    >
                      Switch to Bank Transfer
                    </button>
                  </div>
                )}

                {cardError && cardStep !== 'failed' && (
                  <p className="payment-error">{cardError}</p>
                )}
              </div>
            )}

            <p>Rental: ${totals.rentalTotal}</p>
            <p>Deposit: ${totals.depositTotal}</p>
            <h3>Total due: ${totals.amountDue}</h3>

            <button
              type="submit"
              disabled={
                checkingOut ||
                (paymentMethod === 'Card' &&
                  ['failed', 'processing'].includes(cardStep))
              }
            >
              {checkingOut
                ? 'Processing...'
                : paymentMethod === 'Card' && cardStep === 'info'
                  ? 'Continue to OTP'
                  : paymentMethod === 'Card' && cardStep === 'otp'
                    ? 'Verify and Pay'
                    : 'Confirm Payment and Rent'}
            </button>
          </aside>
        </form>
      )}
    </div>
  );
};

export default Checkout;
