import React, { useState } from 'react';
import api from '../utils/api';
import { Star } from 'lucide-react';

const ReviewForm = ({ movieId, onReviewAdded }) => {
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post(`/movies/${movieId}/reviews`, { rating, reviewText });
            onReviewAdded(res.data);
            setReviewText('');
            setRating(5);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Write a Review</h3>
            {error && <div className="text-red-600 mb-3 text-sm">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Rating</label>
                    <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition transform hover:scale-110"
                            >
                                <Star 
                                    className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="review">
                        Your Review
                    </label>
                    <textarea
                        id="review"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Tell us what you liked or disliked..."
                        required
                    ></textarea>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
