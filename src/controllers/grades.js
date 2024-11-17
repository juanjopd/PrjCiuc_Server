const Grade = require("../model/grade.model");
const Group = require("../model/groups.model");
const Student = require("../model/studens.model");

// Controlador para vincular estudiante a un grupo de curso y guardar la calificación final
class gradeController {
  // Método para vincular estudiante a un curso y guardar la calificación
  async linkStudentToCourseAndSaveGrade(req, res) {
    try {
      const { student_code, group_id, finalGrade } = req.body;
      // Verificar si el estudiante existe
      const student = await Student.findOne({ where: { student_code } });
      if (!student) {
        return res.status(404).json({ message: "Estudiante no encontrado" });
      }

      // Verificar si el grupo existe y es un grupo de tipo "curso"
      const group = await Group.findOne({
        where: { id: group_id, tipo: "curso" },
      });
      if (!group) {
        return res
          .status(404)
          .json({ message: "Grupo de tipo curso no encontrado" });
      }

      // Vincular al estudiante al grupo si no está vinculado ya
      if (student.group_id !== group_id) {
        await student.update({ group_id });
      }

      // Crear o actualizar la calificación final
      const gradeData = { student_id: student_code, grade: finalGrade };
      const [grade, created] = await Grade.upsert(gradeData, {
        where: { student_id: student_code },
        returning: true,
      });

      res.status(200).json({
        message: created
          ? "Calificación de curso creada y estudiante vinculado al grupo."
          : "Calificación de curso actualizada y estudiante vinculado al grupo.",
        grade,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message:
          "Error al vincular estudiante al grupo de curso y guardar calificación",
        error,
      });
    }
  }
}

module.exports = new gradeController();
