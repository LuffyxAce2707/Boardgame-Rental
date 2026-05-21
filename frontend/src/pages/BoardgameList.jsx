import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import API from '../api/axios';

const BoardgameList = () => {

  const navigate = useNavigate();

  const [games, setGames] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await API.get('/boardgames');
        setGames(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const filteredGames = games.filter((game) => {

    return (
      game.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  });

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div
      style={{
        padding: '20px'
      }}
    >

      <h1>Boardgames</h1>

      <input
        type="text"
        placeholder="Search boardgame..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          padding: '10px',
          width: '300px',
          marginBottom: '20px'
        }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}
      >

        {filteredGames.map((game) => (

          <div
            key={game._id}
            style={{
              border: '1px solid gray',
              borderRadius: '10px',
              padding: '15px'
            }}
          >

            {
              game.image && (
                <img
                  src={game.image}
                  alt={game.title}
                  width="100%"
                  height="200"
                  style={{
                    objectFit: 'cover'
                  }}
                />
              )
            }

            <h3>{game.title}</h3>

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
              Rental Price:
              {' '}
              ${game.rentalPrice}
            </p>

            <p>
              Available:
              {' '}
              {game.availableQuantity}
            </p>

            <button
              onClick={() =>
                navigate(
                  `/boardgames/${game._id}`
                )
              }
              style={{
                padding: '10px',
                width: '100%'
              }}
            >
              View Details
            </button>

          </div>

        ))}

      </div>

    </div>
  );

};

export default BoardgameList;