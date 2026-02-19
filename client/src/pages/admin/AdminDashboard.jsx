import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Trash2, Plus, Film, Users, MessageSquare, Edit, Save, X, UserCog, UserMinus } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('movies');
    const [movies, setMovies] = useState([]);
    const [users, setUsers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Editing states
    const [editingReview, setEditingReview] = useState(null);
    const [editForm, setEditForm] = useState({ rating: 0, reviewText: '' });

    // New movie form state
    const [newMovie, setNewMovie] = useState({
        title: '',
        genre: '',
        releaseYear: '',
        director: '',
        cast: '',
        synopsis: '',
        posterUrl: ''
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'movies') {
                const res = await api.get('/movies?limit=100');
                setMovies(res.data.movies);
            } else if (activeTab === 'users') {
                const res = await api.get('/admin/users');
                setUsers(res.data);
            } else if (activeTab === 'reviews') {
                const res = await api.get('/admin/reviews');
                setReviews(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMovieSubmit = async (e) => {
        e.preventDefault();
        try {
            const movieData = {
                ...newMovie,
                genre: newMovie.genre.split(',').map(g => g.trim()),
                cast: newMovie.cast.split(',').map(c => c.trim())
            };
            await api.post('/movies', movieData);
            setNewMovie({ title: '', genre: '', releaseYear: '', director: '', cast: '', synopsis: '', posterUrl: '' });
            fetchData();
            alert('Movie added successfully');
        } catch (err) {
            console.error(err);
            alert('Failed to add movie');
        }
    };

    const handleDeleteMovie = async (id) => {
        if(window.confirm('Are you sure?')) {
            try {
                await api.delete(`/movies/${id}`);
                setMovies(movies.filter(m => m._id !== id));
            } catch (err) {
                console.error(err);
                alert('Failed to delete movie');
            }
        }
    }

    const handleDeleteUser = async (id) => {
        if(window.confirm('Delete user? This cannot be undone.')) {
            try {
                await api.delete(`/admin/users/${id}`);
                setUsers(users.filter(u => u._id !== id));
            } catch (err) {
                console.error(err);
                alert('Failed to delete user');
            }
        }
    }

    const handleUpdateRole = async (id, newRole) => {
        if(window.confirm(`Change user role to ${newRole}?`)) {
            try {
                const res = await api.put(`/admin/users/${id}/role`, { role: newRole });
                setUsers(users.map(u => u._id === id ? { ...u, role: res.data.role } : u));
            } catch (err) {
                console.error(err);
                alert('Failed to update role');
            }
        }
    }

    const handleDeleteReview = async (id) => {
        if(window.confirm('Delete review?')) {
            try {
                await api.delete(`/admin/reviews/${id}`);
                setReviews(reviews.filter(r => r._id !== id));
            } catch (err) {
                console.error(err);
                alert('Failed to delete review');
            }
        }
    }

    const startEditReview = (review) => {
        setEditingReview(review._id);
        setEditForm({ rating: review.rating, reviewText: review.reviewText });
    }

    const cancelEditReview = () => {
        setEditingReview(null);
        setEditForm({ rating: 0, reviewText: '' });
    }

    const saveReview = async (id) => {
        try {
            const res = await api.put(`/admin/reviews/${id}`, editForm);
            setReviews(reviews.map(r => r._id === id ? res.data : r));
            setEditingReview(null);
        } catch (err) {
            console.error(err);
            alert('Failed to update review');
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            
            <div className="flex mb-8 border-b overflow-x-auto whitespace-nowrap">
                <button 
                    onClick={() => setActiveTab('movies')}
                    className={`px-4 py-2 md:px-6 md:py-3 font-medium flex items-center ${activeTab === 'movies' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Film className="w-5 h-5 mr-2" /> Movies
                </button>
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 md:px-6 md:py-3 font-medium flex items-center ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Users className="w-5 h-5 mr-2" /> Users
                </button>
                <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`px-4 py-2 md:px-6 md:py-3 font-medium flex items-center ${activeTab === 'reviews' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <MessageSquare className="w-5 h-5 mr-2" /> Reviews
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <>
                    {activeTab === 'movies' && (
                        <div>
                            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                                <h2 className="text-xl font-bold mb-4 flex items-center"><Plus className="w-5 h-5 mr-2" /> Add New Movie</h2>
                                <form onSubmit={handleMovieSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input placeholder="Title" value={newMovie.title} onChange={e => setNewMovie({...newMovie, title: e.target.value})} className="p-2 border rounded w-full" required />
                                    <input placeholder="Director" value={newMovie.director} onChange={e => setNewMovie({...newMovie, director: e.target.value})} className="p-2 border rounded w-full" required />
                                    <input placeholder="Release Year" type="number" value={newMovie.releaseYear} onChange={e => setNewMovie({...newMovie, releaseYear: e.target.value})} className="p-2 border rounded w-full" required />
                                    <input placeholder="Genres (comma separated)" value={newMovie.genre} onChange={e => setNewMovie({...newMovie, genre: e.target.value})} className="p-2 border rounded w-full" required />
                                    <input placeholder="Cast (comma separated)" value={newMovie.cast} onChange={e => setNewMovie({...newMovie, cast: e.target.value})} className="p-2 border rounded w-full" required />
                                    <input placeholder="Poster URL" value={newMovie.posterUrl} onChange={e => setNewMovie({...newMovie, posterUrl: e.target.value})} className="p-2 border rounded w-full" required />
                                    <textarea placeholder="Synopsis" value={newMovie.synopsis} onChange={e => setNewMovie({...newMovie, synopsis: e.target.value})} className="p-2 border rounded w-full md:col-span-2" rows="3" required></textarea>
                                    <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full md:w-auto md:col-span-2">Add Movie</button>
                                </form>
                            </div>

                            <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {movies.map(movie => (
                                            <tr key={movie._id}>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{movie.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{movie.releaseYear}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{movie.averageRating.toFixed(1)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button onClick={() => handleDeleteMovie(movie._id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5"/></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
                             <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map(u => (
                                            <tr key={u._id}>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{u.username}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{u.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(u.joinDate).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                                                    {/* Promote/Demote Buttons */}
                                                    {u.role === 'user' && (
                                                        <button onClick={() => handleUpdateRole(u._id, 'admin')} className="text-blue-600 hover:text-blue-900" title="Make Admin">
                                                            <UserCog className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {u.role === 'admin' && (
                                                        <button onClick={() => handleUpdateRole(u._id, 'user')} className="text-orange-600 hover:text-orange-900" title="Revoke Admin">
                                                            <UserMinus className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleDeleteUser(u._id)} className="text-red-600 hover:text-red-900" title="Delete User">
                                                        <Trash2 className="w-5 h-5"/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
                             <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movie</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {reviews.map(r => (
                                            <tr key={r._id}>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{r.movie?.title || 'Deleted Movie'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{r.user?.username || 'Deleted User'}</td>
                                                
                                                {/* Editable Cells */}
                                                {editingReview === r._id ? (
                                                    <>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                            <input 
                                                                type="number" 
                                                                min="1" 
                                                                max="5" 
                                                                value={editForm.rating} 
                                                                onChange={e => setEditForm({...editForm, rating: parseInt(e.target.value)})}
                                                                className="w-16 p-1 border rounded"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-500">
                                                            <input 
                                                                type="text" 
                                                                value={editForm.reviewText} 
                                                                onChange={e => setEditForm({...editForm, reviewText: e.target.value})}
                                                                className="w-full p-1 border rounded"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                                                            <button onClick={() => saveReview(r._id)} className="text-green-600 hover:text-green-900"><Save className="w-5 h-5"/></button>
                                                            <button onClick={cancelEditReview} className="text-gray-600 hover:text-gray-900"><X className="w-5 h-5"/></button>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{r.rating}/5</td>
                                                        <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{r.reviewText}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                                                            <button onClick={() => startEditReview(r)} className="text-blue-600 hover:text-blue-900" title="Edit Review"><Edit className="w-5 h-5"/></button>
                                                            <button onClick={() => handleDeleteReview(r._id)} className="text-red-600 hover:text-red-900" title="Delete Review"><Trash2 className="w-5 h-5"/></button>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
