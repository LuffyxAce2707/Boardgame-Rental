import { useCallback, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import API from '../api/axios';

import { rentGame } from '../services/rental.service';

const BoardgameDetail = () => {

  const { id } = useParams();

  const [game, setGame] = useState(null);

  const [loading, setLoading] = useState(true);

  const getGameData = useCallback(async () => {
    const response = await API.get(`/boardgames/${id}`);
    return response.data.data;
  }, [id]);

  useEffect(() => {
    const loadGame = async () => {
      try {
        const gameData = await getGameData();
        setGame(gameData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [getGameData]);

  const refreshGame = async () => {
    const gameData = await getGameData();
    setGame(gameData);
  };

  const handleRent = async () => {

    try {

      await rentGame({
        gameId: game._id,
        quantity: 1,
        days: 3
      });

      alert('Game rented successfully');

      await refreshGame();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        'Failed to rent game'
      );

    }

  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!game) {
    return <h2>Game not found</h2>;
  }

  return (
    <div
      style={{
        padding: '20px'
      }}
    >

      <h1>{game.title}</h1>

      {
        game.imageUrl && (
          <img
            src={game.imageUrl}
            alt={game.title}
            width="300"
          />
        )
      }

      <p>
        Category:
        {' '}
        {game.category}
      </p>

      <p>
        Difficulty:
        {' '}
        {game.difficulty}
      </p>

      <p>
        Players:
        {' '}
        {game.minPlayers}
        {' - '}
        {game.maxPlayers}
      </p>

      <p>
        Play Time:
        {' '}
        {game.playTime}
        {' '}
        mins
      </p>

      <p>
        Rental Price:
        {' '}
        ${game.rentalPrice}
      </p>

      <p>
        Available:
        {' '}
        {game.availableQuantity}
      </p>

      <p>
        Status:
        {' '}
        {game.status}
      </p>

      <button
        onClick={handleRent}
        disabled={game.availableQuantity <= 0}
        style={{
          padding: '10px 20px',
          cursor:
            game.availableQuantity <= 0
              ? 'not-allowed'
              : 'pointer'
        }}
      >

        {
          game.availableQuantity <= 0
            ? 'Out Of Stock'
            : 'Rent Now'
        }

      </button>

    </div>
  );

};

export default BoardgameDetail;
