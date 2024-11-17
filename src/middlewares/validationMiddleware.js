const { body, validationResult, query } = require("express-validator");
const Professors = require("../model/professors.model");
const Programs = require("../model/program.model");

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

const validateRegistrationProfessors = [
  body("name").notEmpty().withMessage("El nombre es requerido"),
  body("email").isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("role")
    .isIn(["admin", "teacher", "student", "adminStudent", "teacherStudent"])
    .withMessage("Rol inválido"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
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
  body("semestre")
    .isIn(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"])
    .withMessage("Semestre incorrecto"),
  body("programa").custom(async (value) => {
    try {
      const programa = await Programs.findByPk(value);
      if (!programa) {
        throw new Error("programa es inválido");
      }
      return true;
    } catch (error) {
      console.log(error);
      throw new Error("Error al validar el programa");
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

// Validación para "curso" (solo la finalGrade)
const validateCourseGrade = [
  body("finalGrade")
    .notEmpty()
    .withMessage("Final grade is required for curso.")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Final grade must be a number between 0 and 5."),
];

// Validación para "examen" (todas las notas)
const validateExamGrades = [
  body("speaking")
    .notEmpty()
    .withMessage("Speaking grade is required.")
    .isFloat({ min: 0, max: 200 })
    .withMessage("Speaking grade must be a number between 0 and 200."),
  body("listening")
    .notEmpty()
    .withMessage("Listening grade is required.")
    .isFloat({ min: 0, max: 200 })
    .withMessage("Listening grade must be a number between 0 and 200."),
  body("reading")
    .notEmpty()
    .withMessage("Reading grade is required.")
    .isFloat({ min: 0, max: 200 })
    .withMessage("Reading grade must be a number between 0 and 200."),
  body("writing")
    .notEmpty()
    .withMessage("Writing grade is required.")
    .isFloat({ min: 0, max: 200 })
    .withMessage("Writing grade must be a number between 0 and 200."),
  body("englishTest")
    .notEmpty()
    .withMessage("English test grade is required.")
    .isFloat({ min: 0, max: 200 })
    .withMessage("English test grade must be a number between 0 and 200."),
];

const validateFacultyReport = [
  query("facultyId")
    .notEmpty()
    .withMessage("El ID de la facultad es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El ID de la facultad debe ser un número entero positivo"),
  query("year")
    .notEmpty()
    .withMessage("El año es obligatorio")
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(
      `El año debe ser un número entero entre 1900 y ${new Date().getFullYear()}`
    ),
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
  validateCourseGrade,
  validateRegistrationProfessors,
  validateFacultyReport,
};
