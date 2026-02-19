import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, Filter, Star } from 'lucide-react';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        search,
        genre: genre !== 'All' ? genre : ''
      };
      
      const res = await api.get('/movies', { params });
      setMovies(res.data.movies);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [page, genre]); // Re-fetch on page or genre change

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page
    fetchMovies();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const genres = ['All', 'Action', 'Drama', 'Comedy', 'Sci-Fi', 'Horror', 'Romance', 'Thriller'];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Browse Movies</h1>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="flex-grow w-full md:w-auto flex items-center border rounded px-3 py-2">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full focus:outline-none text-gray-700"
          />
          <button type="submit" className="ml-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition">Search</button>
        </form>

        <div className="flex items-center w-full md:w-auto">
          <Filter className="text-gray-400 w-5 h-5 mr-2" />
          <select 
            value={genre} 
            onChange={(e) => { setGenre(e.target.value); setPage(1); }}
            className="border rounded px-3 py-2 text-gray-700 focus:outline-none w-full md:w-48"
          >
            {genres.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          {movies.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No movies found.</div>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <div key={movie._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                  <img 
                    src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'} 
                    alt={movie.title} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 truncate">{movie.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>{movie.releaseYear}</span>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1">{movie.averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                    <Link to={`/movies/${movie._id}`} className="block text-center mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded transition">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page === 1}
                className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
              >
                Previous
              </button>
              <span className="px-4 py-2 flex items-center">
                Page {page} of {totalPages}
              </span>
              <button 
                onClick={() => handlePageChange(page + 1)} 
                disabled={page === totalPages}
                className={`px-4 py-2 rounded ${page === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MovieList;
