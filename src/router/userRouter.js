const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const { isAdmin, isTeacher } = require('../middlewares/authMiddleware'); // middlewares

//#region GET
router.get('/users', isAdmin, userController.getAllUsers);
router.get('/users/students', isTeacher, userController.getAllStudents);


//#region POST
router.post('/users', userController.register);

//#region PUT
router.put('/users', isAdmin, userController.updateUser);

//#region DELETE

module.exports = router;
