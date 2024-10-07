const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const { isAdmin, isTeacher } = require('../middlewares/authMiddleware'); // middlewares

router.get('/users', isAdmin, userController.getAllUsers);
router.get('/users/students', isTeacher, userController.getAllStudents);
router.post('/users', userController.register);

module.exports = router;
