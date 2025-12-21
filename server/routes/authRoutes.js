const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getMe, getUsers, deleteUser, makeUserAdmin } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', getMe);

// Admin Routes
router.get('/users', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id/make-admin', protect, admin, makeUserAdmin);

module.exports = router;
