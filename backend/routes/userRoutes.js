const express = require('express');
const router = express.Router();

// Controllers
const { getUserById, getUserPosts } = require('../controllers/userController');

// Route to get user data by userId
router.get('/users/:userId', getUserById);

// Route to get posts of a user by userId
router.get('/users/:userId/posts', getUserPosts);

module.exports = router;
