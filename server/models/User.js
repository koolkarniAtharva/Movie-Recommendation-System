const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    watchlist: [{
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie'
        },
        dateAdded: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports = mongoose.model('User', UserSchema);
