import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import API from '../api/axios';

const GameDetails = () => {

  const { id } = useParams();

  const [game, setGame] = useState(null);

  useEffect(() => {
    fetchGame();
  }, []);

  const fetchGame = async () => {

    const res = await API.get(`/games/${id}`);

    setGame(res.data.data);
  };

  if (!game) {
    return <p>Loading...</p>;
  }

  return (
    <div className="details-page">

      <img
        src={game.image}
        alt={game.title}
      />

      <h1>{game.title}</h1>

      <p>Category: {game.category}</p>

      <p>Players: {game.minPlayers} - {game.maxPlayers}</p>

      <p>Difficulty: {game.difficulty}</p>

      <p>Price: ${game.rentalPrice}</p>
    </div>
  );
};

export default GameDetails;