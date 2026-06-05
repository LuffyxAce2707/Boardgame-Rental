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

      <div className="game-card-media">
        <img
          src={game.imageUrl}
          alt={game.title}
        />
        <span>{game.status || 'Available'}</span>
      </div>

      <div className="game-card-body">
        <div className="game-tags">
          {game.category && <span>{game.category}</span>}
          {game.difficulty && <span>{game.difficulty}</span>}
        </div>

        <h3>{game.title}</h3>

        <p className="game-card-meta">
          {game.minPlayers && game.maxPlayers
            ? `${game.minPlayers}-${game.maxPlayers} players`
            : 'Players vary'}
          {game.playTime ? ` · ${game.playTime} min` : ''}
        </p>

        <p className="game-price">${game.rentalPrice}/day</p>

        <div className="game-card-actions">
          <Link to={`/boardgames/${game._id}`}>
            View Details
          </Link>

          <button
            type="button"
            onClick={addToCart}
            disabled={!game.availableQuantity}
          >
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
