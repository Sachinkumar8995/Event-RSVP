const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    sendEventReminders,
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getEvents).post(protect, admin, createEvent);
router
    .route('/:id')
    .get(getEventById)
    .put(protect, admin, updateEvent)
    .delete(protect, admin, deleteEvent);

router.post('/:id/send-reminder', protect, admin, sendEventReminders);

module.exports = router;
