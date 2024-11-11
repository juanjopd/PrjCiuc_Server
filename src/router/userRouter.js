const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const groupController = require("../controllers/groups");
const { isAdmin, isTeacher } = require("../middlewares/authMiddleware");
const { rateLimiter } = require("../middlewares/rateLimiterMiddleware");
const {
  validateRegistrationInput,
  validateRegistrationInput2,
} = require("../middlewares/validationMiddleware");

//#region GET
router.get("/users", userController.getAllUsers);
router.get("/users/students", userController.getAllStudents);

//#region GET
router.get("/groups", groupController.getAllGroups);
router.get("/groups/professor", groupController.getGroupsByProfessor);
router.get("/professors", groupController.getAllProfessors);

// Obtener Roles existentes
router.get("/roles", (req, res) => {
  const roles = [
    { value: "admin", label: "Administrador" },
    { value: "teacher", label: "Profesor" },
    { value: "student", label: "Estudiante" },
    { value: "teacherStudent", label: "Profesor Estudiante" },
    { value: "adminStudent", label: "Administrativo Estudiante" },
  ];
  res.json(roles);
});

//#region POST
router.post(
  "/groups",
  validateRegistrationInput2, // Middleware de validación
  groupController.register // Controlador de registro
);

router.post(
  "/users",
  validateRegistrationInput, // Middleware de validación
  rateLimiter, // Middleware de limitación de tasa
  userController.register // Controlador de registro
);

//#region PUT
router.put("/users", isAdmin, userController.updateUser);

//#region DELETE
router.delete("/users", isAdmin, userController.deleteUser);

module.exports = router;
