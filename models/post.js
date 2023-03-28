const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    user: { type: String, required: true },
    media: { type: String },
    details: { type: String, required: true },
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: { type: String }
    }],
    likes: [{ type: String }],
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Post', postSchema);