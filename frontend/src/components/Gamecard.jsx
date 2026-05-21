import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {

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
    </div>
  );
};

export default GameCard;