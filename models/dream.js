const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dreamSchema = new Schema({
    user: { type: String, required: true },
    media: { type: String },
    details: { type: String, required: true },
    private: { type: Boolean, required: true },
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: { type: String }
    }],
    likes: [{ type: String }],
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Dream', dreamSchema);