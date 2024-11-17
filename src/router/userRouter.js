const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const groupController = require("../controllers/groups");
const gradeController = require("../controllers/grades");
const facultadController = require("../controllers/facultades");
const { isAdmin, isTeacher } = require("../middlewares/authMiddleware");
const { rateLimiter } = require("../middlewares/rateLimiterMiddleware");
const {
  validateRegistrationInput,
  validateRegistrationInput2,
  validateCourseGrade,
  validateRegistrationProfessors,
  validateFacultyReport,
} = require("../middlewares/validationMiddleware");

//#region GET
router.get("/users", userController.getAllUsers);
router.get("/users/students", userController.getAllStudents);

//#region GET
router.get("/groups", groupController.getAllGroups);
router.get("/groups/professor", groupController.getGroupsByProfessor);
router.get("/professors", groupController.getAllProfessors);

//obtener los programas
router.get("/programa", userController.getProgramas);

//obtener estudiantes por programas
router.get("/byprogramas", userController.getEnrollmentCountByProgram);

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

router.get("/groups-count", groupController.getGroupsCountByYearAndGeneratePDF);
router.get(
  "/groups-count-by-professor",
  groupController.getGroupsCountByProfessorAndGeneratePDF
);

router.get("/Faculties", facultadController.getFaculties);

router.get(
  "/groups-by-faculty",
  validateFacultyReport,
  facultadController.generateFacultyReport
);

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

router.post(
  "/teacher",
  validateRegistrationProfessors,
  rateLimiter,
  userController.register
);

/* router.put(
  "/students/:studentCode/grade",
  validateCourseGrade,
  gradeController.linkStudentToCourseAndSaveGrade
);
 */
//#region PUT
router.put("/users", isAdmin, userController.updateUser);

//#region DELETE
router.delete("/users", isAdmin, userController.deleteUser);

module.exports = router;
