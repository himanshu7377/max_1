const express = require('express');
const { registerUser, loginUser ,getCurrentUser} = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user', getCurrentUser);

module.exports = router;
