import { useEffect, useState } from 'react';

import API from '../api/axios';

const Home = () => {

  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {

    const res = await API.get('/games');

    setGames(res.data.data || res.data);
  };

  return (
    <div className="container">

      <h1>Boardgame Collection</h1>

      {games.map((game) => (
        <div key={game._id}>
          {game.title}
        </div>
      ))}
    </div>
  );
};

export default Home;
