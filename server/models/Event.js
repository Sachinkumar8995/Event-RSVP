const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Creator
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true }, // Store as ISO string or Date
    time: { type: String, required: true },
    location: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: [
            'Music & Concerts',
            'Tech & Workshops',
            'Food & Drink',
            'Arts & Culture',
            'Sports & Fitness',
            'Business',
            'Networking',
            'Charity'
        ]
    },
}, {
    timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
