const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateLoginInput = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  handleValidationErrors
];

const validateEmailInput = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  handleValidationErrors
];

const validatePasswordResetInput = [
  body('token').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
  handleValidationErrors
];

const validateRegistrationInput = [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('role').isIn(['admin', 'teacher', 'student', 'adminStudent', 'teacherStudent']).withMessage('Rol inválido'),
  body('studentCode').if(body('role').equals('student')).notEmpty().withMessage('El código de estudiante es requerido para estudiantes'),
  handleValidationErrors
];

module.exports = { validateRegistrationInput, validateLoginInput, validateEmailInput, validatePasswordResetInput };
