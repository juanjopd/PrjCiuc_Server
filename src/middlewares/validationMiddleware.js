const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.validateLoginInput = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  handleValidationErrors
];

exports.validateEmailInput = [
  body('email').isEmail().normalizeEmail(),
  handleValidationErrors
];

exports.validatePasswordResetInput = [
  body('token').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
  handleValidationErrors
];