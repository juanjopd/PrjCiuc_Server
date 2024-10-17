const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const { isAdmin, isTeacher } = require('../middlewares/authMiddleware'); 
const {rateLimiter} = require('../middlewares/rateLimiterMiddleware');
const { validateRegistrationInput } = require('../middlewares/validationMiddleware');

//#region GET
router.get('/users', isAdmin, userController.getAllUsers);
router.get('/users/students', isTeacher, userController.getAllStudents);


//#region POST
router.post('/users',
  validateRegistrationInput,  // Middleware de validación
  rateLimiter,  // Middleware de limitación de tasa
  userController.register  // Controlador de registro
);


//#region PUT
router.put('/users', isAdmin, userController.updateUser);

//#region DELETE
router.delete('/users', isAdmin, userController.deleteUser);

module.exports = router;
