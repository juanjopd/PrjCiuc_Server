const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLoginInput, validateEmailInput, validatePasswordResetInput } = require('../middlewares/validationMiddleware');
const { rateLimiter } = require('../middlewares/rateLimiterMiddleware');

//region Auth Session
router.post('/login', validateLoginInput, rateLimiter, authController.login);
router.post('/logout', authController.logout);

//region Auth Account
router.post('/recover-password', validateEmailInput, rateLimiter, authController.recoverPassword);
router.post('/reset-password', validatePasswordResetInput, authController.resetPassword);
router.get('/verify-account/:token', authController.verifyAccount);

module.exports = router;
