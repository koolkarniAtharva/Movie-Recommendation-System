const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin'); // Import admin middleware
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const User = require('../models/User');

// @route   GET /api/movies
// @desc    Get all movies with pagination and filtering
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, genre, search } = req.query;
        const query = {};

        if (genre) {
            query.genre = genre;
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const movies = await Movie.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Movie.countDocuments(query);

        res.json({
            movies,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/movies/:id
// @desc    Get movie by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({ msg: 'Movie not found' });
        }

        res.json(movie);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Movie not found' });
        }
        res.status(500).send('Server error');
    }
});

// @route   POST /api/movies
// @desc    Add a new movie (Admin only)
// @access  Private/Admin
// @access  Private/Admin

router.post('/', [auth, admin], async (req, res) => {
    try {
        const newMovie = new Movie(req.body);
        const movie = await newMovie.save();
        res.json(movie);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE /api/movies/:id
// @desc    Delete movie (Admin only)
// @access  Private/Admin
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ msg: 'Movie not found' });
        }
        await movie.deleteOne();
        res.json({ msg: 'Movie removed' }); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/movies/:id/reviews
// @desc    Get reviews for a movie
// @access  Public
router.get('/:id/reviews', async (req, res) => {
    try {
        const reviews = await Review.find({ movie: req.params.id })
            .populate('user', ['username', 'profilePicture'])
            .sort({ timestamp: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/movies/:id/reviews
// @desc    Add a review for a movie
// @access  Private
router.post('/:id/reviews', auth, async (req, res) => {
    const { rating, reviewText } = req.body;

    try {
        const user = await User.findById(req.user.id).select('-password');
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({ msg: 'Movie not found' });
        }

        const newReview = new Review({
            user: req.user.id,
            movie: req.params.id,
            rating,
            reviewText,
            username: user.username
        });

        const review = await newReview.save();

        // Recalculate average rating
        const reviews = await Review.find({ movie: req.params.id });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        movie.averageRating = avgRating;
        await movie.save();

        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
