const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Review = require('../models/Review');
const Movie = require('../models/Movie');

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', [auth, admin], async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ joinDate: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/admin/reviews
// @desc    Get all reviews
// @access  Private/Admin
router.get('/reviews', [auth, admin], async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', ['username', 'email'])
            .populate('movie', ['title'])
            .sort({ timestamp: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE /api/admin/reviews/:id
// @desc    Delete a review
// @access  Private/Admin
router.delete('/reviews/:id', [auth, admin], async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        const movieId = review.movie;
        await review.deleteOne();

        // Recalculate average rating
        const reviews = await Review.find({ movie: movieId });
        const avgRating = reviews.length > 0 
            ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
            : 0;

        await Movie.findByIdAndUpdate(movieId, { averageRating: avgRating });

        res.json({ msg: 'Review removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put('/users/:id/role', [auth, admin], async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ msg: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { role }, 
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT /api/admin/reviews/:id
// @desc    Edit a review
// @access  Private/Admin
router.put('/reviews/:id', [auth, admin], async (req, res) => {
    try {
        const { rating, reviewText } = req.body;
        
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        // Update fields
        if (rating) review.rating = rating;
        if (reviewText) review.reviewText = reviewText;

        await review.save();

        // Recalculate average rating for the movie
        const reviews = await Review.find({ movie: review.movie });
        const avgRating = reviews.length > 0 
            ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
            : 0;

        await Movie.findByIdAndUpdate(review.movie, { averageRating: avgRating });
        
        // Return updated review with populated fields for dashboard
        const updatedReview = await Review.findById(req.params.id)
            .populate('user', ['username', 'email'])
            .populate('movie', ['title']);
            
        res.json(updatedReview);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private/Admin
router.delete('/users/:id', [auth, admin], async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        await Review.deleteMany({ user: req.params.id });
        
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
