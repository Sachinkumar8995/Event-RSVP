const Event = require('../models/Event');
const RSVP = require('../models/RSVP');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const events = await Event.find({}).sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
    const { title, description, date, time, location, category } = req.body;

    try {
        const event = new Event({
            user: req.user._id,
            title,
            description,
            date,
            time,
            location,
            category,
        });

        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
    const { title, description, date, time, location, category } = req.body;

    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            event.title = title || event.title;
            event.description = description || event.description;
            event.date = date || event.date;
            event.time = time || event.time;
            event.location = location || event.location;
            event.category = category || event.category;

            const updatedEvent = await event.save();
            res.json(updatedEvent);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            await event.deleteOne();
            // Also remove RSVPs
            await RSVP.deleteMany({ event: event._id });
            res.json({ message: 'Event removed' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Send reminder emails to all RSVP'd users
// @route   POST /api/events/:id/send-reminder
// @access  Private/Admin
const sendEventReminders = async (req, res) => {
    try {
        const { sendEventReminder } = require('../config/email');
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Get all RSVPs for this event with "going" or "maybe" status
        const rsvps = await RSVP.find({
            event: event._id,
            status: { $in: ['going', 'maybe'] }
        }).populate('user', 'name email');

        if (rsvps.length === 0) {
            return res.status(404).json({ message: 'No users have RSVP\'d to this event' });
        }

        // Send emails to all users
        const results = [];
        for (const rsvp of rsvps) {
            if (rsvp.user && rsvp.user.email) {
                const result = await sendEventReminder(
                    rsvp.user.email,
                    rsvp.user.name,
                    event
                );
                results.push({
                    email: rsvp.user.email,
                    success: result.success
                });
            }
        }

        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        res.json({
            message: `Reminder emails sent to ${successCount} user(s)`,
            total: rsvps.length,
            success: successCount,
            failed: failCount,
            details: results
        });
    } catch (error) {
        console.error('Error sending reminders:', error);
        res.status(500).json({ message: 'Failed to send reminder emails: ' + error.message });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    sendEventReminders,
};
