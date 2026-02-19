import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Star, Clock, Calendar, User, Plus, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';

const MovieDetail = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInWatchlist, setIsInWatchlist] = useState(false);

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const movieRes = await api.get(`/movies/${id}`);
                setMovie(movieRes.data);

                const reviewsRes = await api.get(`/movies/${id}/reviews`);
                setReviews(reviewsRes.data);

                if (isAuthenticated) {
                    const userRes = await api.get('/users/profile'); // Or populate watchlist in auth context
                    // Ideally check against watchlist from user context or separate API
                    // For now, let's fetch watchlist separately or assume we can check
                    const watchlistRes = await api.get('/users/watchlist');
                    // Check if watchlist items are populated objects or just IDs, 
                    // dependent on backend response. Based on users.js update, it returns populated movies.
                    const watchlistIds = watchlistRes.data.map(item => {
                        // Handle both populated object and potentially unpopulated ID scenarios for robustness
                        return item.movie?._id || item.movie; 
                    });
                    setIsInWatchlist(watchlistIds.includes(id));
                }
            } catch (err) {
                console.error('Error fetching movie details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieData();
    }, [id, isAuthenticated]);

    const addToWatchlist = async () => {
        try {
            await api.post(`/users/watchlist/${id}`);
            setIsInWatchlist(true);
        } catch (err) {
            console.error('Error adding to watchlist:', err);
        }
    };

    const removeFromWatchlist = async () => {
        try {
            await api.delete(`/users/watchlist/${id}`);
            setIsInWatchlist(false);
        } catch (err) {
            console.error('Error removing from watchlist:', err);
        }
    };

    const handleReviewAdded = (newReview) => {
        setReviews([newReview, ...reviews]);
        // Optionally update average rating locally or re-fetch movie
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!movie) return <div className="text-center py-10">Movie not found</div>;

    return (
        <div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row mb-8">
                <div className="md:w-1/3">
                    <img 
                        src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'} 
                        alt={movie.title} 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-8 md:w-2/3">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">{movie.title}</h1>
                            <div className="flex items-center text-gray-600 mb-4 space-x-4">
                                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {movie.releaseYear}</span>
                                <span className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" /> {movie.averageRating?.toFixed(1) || 'N/A'}</span>
                            </div>
                        </div>
                        {isAuthenticated && (
                            <button 
                                onClick={isInWatchlist ? removeFromWatchlist : addToWatchlist}
                                className={`flex items-center px-4 py-2 rounded font-medium transition ${
                                    isInWatchlist 
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {isInWatchlist ? <><Check className="w-4 h-4 mr-2" /> In Watchlist</> : <><Plus className="w-4 h-4 mr-2" /> Add to Watchlist</>}
                            </button>
                        )}
                    </div>
                    
                    <p className="text-gray-700 text-lg mb-6 leading-relaxed">{movie.synopsis}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                            <span className="font-bold text-gray-800 block">Director</span>
                            {movie.director}
                        </div>
                        <div>
                            <span className="font-bold text-gray-800 block">Cast</span>
                            {movie.cast && movie.cast.join(', ')}
                        </div>
                        <div>
                            <span className="font-bold text-gray-800 block">Genre</span>
                            {movie.genre && movie.genre.join(', ')}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Reviews</h2>
                
                {isAuthenticated ? (
                    <div className="mb-8">
                        <ReviewForm movieId={id} onReviewAdded={handleReviewAdded} />
                    </div>
                ) : (
                    <div className="bg-gray-50 p-6 rounded-lg mb-8 text-center text-gray-600">
                        Please <Link to="/login" className="text-blue-600 font-semibold">login</Link> to write a review.
                    </div>
                )}

                <div className="space-y-4">
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="bg-white p-6 rounded-lg shadow border border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="font-semibold text-gray-800">{review.user?.username || 'Unknown User'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <span>{new Date(review.timestamp).toLocaleDateString()}</span>
                                        <div className="flex items-center text-yellow-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="ml-1 font-bold">{review.rating}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-700">{review.reviewText}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;
