const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Movie = require('../models/Movie');

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/users/watchlist
// @desc    Get user watchlist
// @access  Private
router.get('/watchlist', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('watchlist.movie');
        // Map to return cleaner structure if needed, or just return as is
        res.json(user.watchlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/users/watchlist/:movieId
// @desc    Add movie to watchlist
// @access  Private
router.post('/watchlist/:movieId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const movie = await Movie.findById(req.params.movieId);

        if (!movie) {
            return res.status(404).json({ msg: 'Movie not found' });
        }

        // Check if movie already in watchlist
        // Safely access item.movie to handle potential legacy data structure or missing refs
        if (user.watchlist.some(item => item.movie && item.movie.toString() === req.params.movieId)) {
            return res.status(400).json({ msg: 'Movie already in watchlist' });
        }

        user.watchlist.push({ movie: req.params.movieId });
        await user.save();

        const updatedUser = await User.findById(req.user.id).populate('watchlist.movie');
        res.json(updatedUser.watchlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE /api/users/watchlist/:movieId
// @desc    Remove movie from watchlist
// @access  Private
router.delete('/watchlist/:movieId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // Check if movie in watchlist
        // Safely access item.movie
        const removeIndex = user.watchlist.findIndex(item => item.movie && item.movie.toString() === req.params.movieId);
        if (removeIndex === -1) {
            return res.status(404).json({ msg: 'Movie not found in watchlist' });
        }

        user.watchlist.splice(removeIndex, 1);
        await user.save();

        const updatedUser = await User.findById(req.user.id).populate('watchlist.movie');
        res.json(updatedUser.watchlist);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/users/:id
// @desc    Get specific user profile by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server error');
    }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private (User can only update own profile unless admin)
router.put('/:id', auth, async (req, res) => {
    try {
        // Ensure user is updating their own profile or is admin
        // Note: admin check would require extra middleware or logic, keeping basic self-update for now
        if (req.user.id !== req.params.id) {
             return res.status(401).json({ msg: 'User not authorized' });
        }

        const { username, email } = req.body;
        const userFields = {};
        if (username) userFields.username = username;
        if (email) userFields.email = email;

        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: userFields },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
