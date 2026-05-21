import { useEffect, useState } from 'react';

import API from '../api/axios';

import GameCard from '../components/GameCard';

const Home = () => {

  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {

    try {

      const res = await API.get('/boardgames');

      setGames(res.data.data || res.data);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">

      <h1>Boardgame Collection</h1>

      <div className="games-grid">
        {games.map((game) => (
          <GameCard
            key={game._id}
            game={game}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;