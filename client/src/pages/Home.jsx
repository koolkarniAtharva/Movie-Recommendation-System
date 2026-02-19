import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Star } from 'lucide-react';

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await api.get('/movies?limit=6');
        setFeaturedMovies(res.data.movies);
      } catch (err) {
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div>
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to MovieReviews</h1>
        <p className="text-xl text-gray-600 mb-8">Discover, Review, and Share your favorite movies.</p>
        <Link to="/movies" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
          Browse Movies
        </Link>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-yellow-500 pl-3">Featured Movies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredMovies.map((movie) => (
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
      </section>
    </div>
  );
};

export default Home;
