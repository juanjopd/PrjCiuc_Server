const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLoginInput, validateEmailInput, validatePasswordResetInput } = require('../middlewares/validationMiddleware');
const { rateLimiter } = require('../middlewares/rateLimiterMiddleware');

//region Auth Session
router.post('/login',
  (req, res, next) => {
    console.log('Middleware de validación iniciado');
    validateLoginInput(req, res, next);
  },
  (req, res, next) => {
    console.log('Rate limiter iniciado');
    rateLimiter(req, res, next);
  },
  (req, res) => {
    console.log('Controlador de inicio de sesión iniciado');
    authController.login(req, res);
  }
);

router.post('/logout', authController.logout);

//region Auth Account
router.post('/recover-password',
  (req, res, next) => {
    console.log('Middleware de validación de email iniciado');
    validateEmailInput(req, res, next);
  },
  (req, res, next) => {
    console.log('Rate limiter iniciado');
    rateLimiter(req, res, next);
  },
  (req, res) => {
    console.log('Controlador de recuperación de contraseña iniciado');
    authController.recoverPassword(req, res);
  }
);

router.post('/reset-password',
  (req, res, next) => {
    console.log('Middleware de validación de restablecimiento de contraseña iniciado');
    validatePasswordResetInput(req, res, next);
  },
  (req, res) => {
    console.log('Controlador de restablecimiento de contraseña iniciado');
    authController.resetPassword(req, res);
  }
);
router.get('/verify-account/:token', authController.verifyAccount);

module.exports = router;
