const RSVP = require('../models/RSVP');
const Event = require('../models/Event');

// @desc    Create or Update RSVP
// @route   POST /api/rsvp
// @access  Private
const rsvpToEvent = async (req, res) => {
    const { eventId, status } = req.body;

    try {
        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if RSVP exists
        let rsvp = await RSVP.findOne({ user: req.user._id, event: eventId });

        if (rsvp) {
            rsvp.status = status;
            await rsvp.save();
            return res.json(rsvp);
        } else {
            rsvp = await RSVP.create({
                user: req.user._id,
                event: eventId,
                status,
            });
            return res.status(201).json(rsvp);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get My RSVPs
// @route   GET /api/rsvp/my
// @access  Private
const getMyRSVPs = async (req, res) => {
    try {
        const rsvps = await RSVP.find({ user: req.user._id }).populate(
            'event',
            'title date time location'
        );
        res.json(rsvps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get RSVPs for an Event (Admin/Public?)
// @route   GET /api/rsvp/event/:eventId
// @access  Public
const getEventRSVPs = async (req, res) => {
    try {
        const rsvps = await RSVP.find({ event: req.params.eventId }).populate(
            'user',
            'name email'
        );
        res.json(rsvps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { rsvpToEvent, getMyRSVPs, getEventRSVPs };
