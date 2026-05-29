import { useEffect, useState } from 'react';

import API from '../api/axios';

import GameCard from '../components/GameCard';

const Home = () => {

  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    players: '',
    maxPlayTime: '',
    minPrice: '',
    maxPrice: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const res = await API.get('/boardgames', {
          params: {
            page,
            limit: 5,
            ...Object.fromEntries(
              Object.entries(filters).filter(([, value]) => value !== '')
            )
          }
        });
        setGames(res.data.data || res.data);
        setPagination(
          res.data.pagination || {
            page,
            limit: 5,
            total: res.data.data?.length || 0,
            totalPages: 1
          }
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [page, filters]);

  const updateFilter = (field, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      difficulty: '',
      players: '',
      maxPlayTime: '',
      minPrice: '',
      maxPrice: '',
      status: ''
    });
    setPage(1);
  };

  return (
    <div className="container">

      <h1>Boardgame Collection</h1>

      <div className="filters-panel">
        <label>
          Category
          <input
            type="text"
            placeholder="Strategy"
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
          />
        </label>

        <label>
          Difficulty
          <select
            value={filters.difficulty}
            onChange={(e) => updateFilter('difficulty', e.target.value)}
          >
            <option value="">Any</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>

        <label>
          Players
          <input
            type="number"
            min="1"
            placeholder="4"
            value={filters.players}
            onChange={(e) => updateFilter('players', e.target.value)}
          />
        </label>

        <label>
          Max Play Time
          <input
            type="number"
            min="1"
            placeholder="60"
            value={filters.maxPlayTime}
            onChange={(e) => updateFilter('maxPlayTime', e.target.value)}
          />
        </label>

        <label>
          Min Price
          <input
            type="number"
            min="0"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
          />
        </label>

        <label>
          Max Price
          <input
            type="number"
            min="0"
            placeholder="10"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
          />
        </label>

        <label>
          Status
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
          >
            <option value="">Any</option>
            <option value="Available">Available</option>
            <option value="Maintenance">Maintenance</option>
            <option value="OutOfStock">Out of stock</option>
          </select>
        </label>

        <button type="button" onClick={clearFilters}>
          Clear
        </button>
      </div>

      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          {games.length === 0 ? (
            <p>No boardgames match the selected filters.</p>
          ) : (
            <div className="games-grid">
              {games.map((game) => (
                <GameCard
                  key={game._id}
                  game={game}
                />
              ))}
            </div>
          )}

          <div className="pagination">
            <button
              type="button"
              onClick={() => setPage((currentPage) => currentPage - 1)}
              disabled={page <= 1}
            >
              Previous
            </button>

            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage((currentPage) => currentPage + 1)}
              disabled={page >= pagination.totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
