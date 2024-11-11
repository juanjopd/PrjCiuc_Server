const { body, validationResult } = require("express-validator");
const Professors = require("../model/professors.model");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateLoginInput = [
  body("email").isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  handleValidationErrors,
];

const validateEmailInput = [
  body("email").isEmail().withMessage("Email inválido"),
  handleValidationErrors,
];

const validatePasswordResetInput = [
  body("token").notEmpty(),
  body("newPassword").isLength({ min: 6 }),
  handleValidationErrors,
];

const validateRegistrationInput = [
  body("name").notEmpty().withMessage("El nombre es requerido"),
  body("email").isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("role")
    .isIn(["admin", "teacher", "student", "adminStudent", "teacherStudent"])
    .withMessage("Rol inválido"),
  body("studentCode")
    .if(body("role").equals("student"))
    .notEmpty()
    .withMessage("El código de estudiante es requerido para estudiantes"),
  handleValidationErrors,
];

const validateRegistrationInput2 = [
  body("name").notEmpty().withMessage("El nombre del grupo es requerido"),
  body("tipo").isIn(["examen", "curso"]).withMessage("tipo es inválido"),
  body("nivel").notEmpty().withMessage("El nivel del grupo es requerido"),
  body("idioma")
    .isIn(["ingles", "italiano", "portugues "])
    .withMessage("idioma es inválido"),
  body("profesor").custom(async (value) => {
    try {
      const professor = await Professors.findByPk(value); // Buscar por ID
      if (!professor) {
        throw new Error("profesor es inválido");
      }
      return true;
    } catch (error) {
      console.log(error);
      throw new Error("Error al validar el profesor");
    }
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
/*  */

module.exports = {
  validateRegistrationInput,
  validateLoginInput,
  validateEmailInput,
  validatePasswordResetInput,
  validateRegistrationInput2,
};
