import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, Film, Star } from 'lucide-react';

const Profile = () => {
    const { user, loading: authLoading } = useAuth();
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const res = await api.get('/users/watchlist');
                setWatchlist(res.data);
            } catch (err) {
                console.error('Error fetching watchlist:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchWatchlist();
        }
    }, [user]);

    if (authLoading || loading) return <div className="text-center py-10">Loading...</div>;
    if (!user) return <div className="text-center py-10">Please login to view profile</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8 flex items-center space-x-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <User className="w-12 h-12" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500 mt-2">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <Film className="w-6 h-6 mr-2" />
                My Watchlist
            </h2>

            {watchlist.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded text-center text-gray-500">
                    Your watchlist is empty. Browse movies to add them here!
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {watchlist.map((item) => {
                        if (!item.movie) return null; // Skip invalid entries
                        return (
                            <div key={item.movie._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                                <img 
                                    src={item.movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'} 
                                    alt={item.movie.title} 
                                    className="w-full h-64 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2 truncate">{item.movie.title}</h3>
                                    <p className="text-xs text-gray-400 mb-2">Added on {new Date(item.dateAdded).toLocaleDateString()}</p>
                                    <Link to={`/movies/${item.movie._id}`} className="block text-center mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded transition">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Profile;
