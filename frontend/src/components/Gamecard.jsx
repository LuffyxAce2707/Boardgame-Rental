import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
  const addToCart = () => {
    const currentCart = JSON.parse(localStorage.getItem('rentalCart')) || [];
    const existingItem = currentCart.find((item) => item._id === game._id);

    const nextCart = existingItem
      ? currentCart.map((item) =>
          item._id === game._id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  game.availableQuantity || 1
                )
              }
            : item
        )
      : [
          ...currentCart,
          {
            _id: game._id,
            title: game.title,
            imageUrl: game.imageUrl,
            rentalPrice: game.rentalPrice,
            availableQuantity: game.availableQuantity,
            quantity: 1
          }
        ];

    localStorage.setItem('rentalCart', JSON.stringify(nextCart));
    window.dispatchEvent(new Event('rental-cart-updated'));
    alert('Added to checkout');
  };

  return (
    <div className="game-card">

      <img
        src={game.imageUrl}
        alt={game.title}
      />

      <h3>{game.title}</h3>

      <p>{game.category}</p>

      <p>${game.rentalPrice}</p>

      <Link to={`/boardgames/${game._id}`}>
        View Details
      </Link>

      <button
        type="button"
        onClick={addToCart}
        disabled={!game.availableQuantity}
        style={{ marginLeft: '10px' }}
      >
        Add to Checkout
      </button>
    </div>
  );
};

export default GameCard;
