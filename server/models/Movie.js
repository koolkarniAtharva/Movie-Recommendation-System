const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: [{
        type: String
    }],
    releaseYear: {
        type: Number
    },
    director: {
        type: String
    },
    cast: [{
        type: String
    }],
    synopsis: {
        type: String
    },
    posterUrl: {
        type: String
    },
    averageRating: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Movie', MovieSchema);
