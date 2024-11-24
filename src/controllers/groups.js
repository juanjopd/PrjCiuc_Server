const Group = require("../model/groups.model");
const Professors = require("../model/professors.model");
const Student = require("../model/studens.model");
const Courses = require("../model/courses.model");
const PDFDocument = require("pdfkit");
const { Sequelize } = require("sequelize");
const path = require("path");

class GroupController {
  async register(req, res) {
    const { name, tipo, grupo, nivel, idioma, profesor } = req.body;
    try {
      // Create the new group entry
      const newGroup = await Group.create({
        name,
        tipo,
        grupo,
        nivel,
        idioma,
        profesor_id: profesor,
      });

      // Send success response
      return res.status(201).json({
        message: "Grupo creado exitosamente.",
        group: newGroup,
      });
    } catch (error) {
      console.error("Error al crear el grupo:", error);
      return res.status(500).json({
        message: "Error al crear el grupo.",
        error: error.message,
      });
    }
  }

  // Method to get all groups
  async getAllGroups(req, res) {
    try {
      const groups = await Group.findAll({
        include: Professors, // Include associated professor if any
      });
      return res.status(200).json({ message: "Grupos encontrados.", groups });
    } catch (error) {
      console.error("Error al obtener todos los grupos:", error);
      return res.status(500).json({
        message: "Error al obtener los grupos.",
        error: error.message,
      });
    }
  }

  // Method to get groups by professor
  async getGroupsByProfessor(req, res) {
    const { profesorName } = req.params; // Assuming you pass the professor's name as a URL parameter

    try {
      // Find professor by name
      const professor = await Professors.findOne({
        where: { name: profesorName },
      });

      if (!professor) {
        return res.status(404).json({ message: "Profesor no encontrado." });
      }

      // Fetch groups associated with the professor
      const groups = await Group.findAll({
        where: { profesor: professor.name },
        include: Professors, // Include associated professor if any
      });

      return res.status(200).json({ message: "Grupos encontrados.", groups });
    } catch (error) {
      console.error("Error al obtener grupos por profesor:", error);
      return res.status(500).json({
        message: "Error al obtener los grupos.",
        error: error.message,
      });
    }
  }

  // Method to get all professors
  async getAllProfessors(req, res) {
    try {
      const professors = await Professors.findAll(); // Asegúrate de que la consulta sea correcta
      return res.status(200).json(professors);
    } catch (error) {
      console.error("Error al obtener profesores:", error);
      return res.status(500).json({ message: "Error al obtener profesores." });
    }
  }
  // Method to close a group
  async closeGroup(req, res) {
    const { groupId } = req.params; // Assuming group ID is passed as a URL parameter

    try {
      // Find the group by ID
      const group = await Group.findByPk(groupId);

      if (!group) {
        return res.status(404).json({ message: "Grupo no encontrado." });
      }

      // Update the group's status to closed (assuming you have a 'status' field)
      group.status = "closed";
      await group.save();

      return res
        .status(200)
        .json({ message: "Grupo cerrado exitosamente.", group });
    } catch (error) {
      console.error("Error al cerrar el grupo:", error);
      return res.status(500).json({
        message: "Error al cerrar el grupo.",
        error: error.message,
      });
    }
  }

  async getGroupsCountByYearAndGeneratePDF(req, res) {
    try {
      // Agrupa los grupos por año de creación y cuenta la cantidad en cada año
      const groupsByYear = await Group.findAll({
        attributes: [
          [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "year"],
          [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
        ],
        group: ["year"],
        raw: true,
      });

      // Crear el documento PDF
      const doc = new PDFDocument();
      let buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        res
          .writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Length": pdfData.length,
          })
          .end(pdfData);
      });

      // Ruta absoluta de la imagen
      const imagePath = path.join(__dirname, "../assets/logoM.png");

      // Agregar imagen en la parte superior izquierda
      doc.image(imagePath, 30, 30, { width: 80 }); // Ajusta la ruta y tamaño

      // Añadir título y datos al PDF
      doc
        .fontSize(20)
        .text("Reporte de Grupos Creados por Año", { align: "center" });
      doc.moveDown();
      groupsByYear.forEach((entry) => {
        doc
          .fontSize(14)
          .text(`Año: ${entry.year} - Cantidad de Grupos: ${entry.count}`);
      });

      // Finalizar el documento PDF
      doc.end();
    } catch (error) {
      console.error("Error al generar el reporte de grupos por año:", error);
      return res.status(500).json({
        message: "Error al generar el reporte de grupos por año.",
        error: error.message,
      });
    }
  }

  async getGroupsCountByProfessorAndGeneratePDF(req, res) {
    try {
      // Obtener la cantidad de grupos por profesor, diferenciando entre "curso" y "examen"
      const groupsByProfessor = await Group.findAll({
        attributes: [
          "profesor_id", // Referencia al ID del profesor
          "tipo", // Incluimos el tipo para diferenciar "curso" y "examen"
          [Sequelize.fn("COUNT", Sequelize.col("Groups.id")), "groupCount"], // Contamos los grupos (especificando la tabla 'Groups')
        ],
        group: ["profesor_id", "tipo"], // Agrupamos por profesor y tipo de grupo
        include: [
          {
            model: Professors,
            attributes: ["name"], // Incluir el nombre del profesor
          },
        ],
        raw: true,
      });

      // Crear el documento sPDF
      const doc = new PDFDocument();
      let buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        res
          .writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Length": pdfData.length,
          })
          .end(pdfData);
      });

      // Ruta absoluta de la imagen
      const imagePath = path.join(__dirname, "../assets/logoM.png");

      // Agregar imagen en la parte superior izquierda
      doc.image(imagePath, 30, 30, { width: 80 }); // Ajusta la ruta y tamaño

      // Añadir título y datos al PDF
      doc
        .fontSize(20)
        .text("Reporte de Grupos por Profesor", { align: "center" });
      doc.moveDown();

      // Iterar sobre los grupos por profesor y tipo
      groupsByProfessor.forEach((entry) => {
        doc
          .fontSize(14)
          .text(
            `Profesor: ${entry["Professor.name"]} - Tipo: ${entry.tipo} - Grupos: ${entry.groupCount}`
          );
      });

      // Finalizar el documento PDF
      doc.end();
    } catch (error) {
      console.error(
        "Error al generar el reporte de grupos por profesor:",
        error
      );
      return res.status(500).json({
        message: "Error al generar el reporte de grupos por profesor.",
        error: error.message,
      });
    }
  }

  async addStudentesToGroup(req, res) {
    const { id, students } = req.body;

    if (!id || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "Datos incompletos o inválidos" });
    }

    try {
      const group = await Group.findByPk(id);
      if (!group) {
        return res.status(404).json({ message: "Grupo no encontrado" });
      }

      const promises = students.map(async ({ student_code }) => {
        // Buscar estudiante usando `student_code` como clave primaria
        const student = await Student.findOne({ where: { student_code } });

        if (!student) {
          throw new Error(
            `Estudiante con código ${student_code} no encontrado`
          );
        }

        // Asociar estudiante con el grupo
        student.group_id = id;
        await student.save();

        // Crear o buscar el curso asociado al estudiante usando `student_code`
        const course = await Courses.findOne({
          where: { student_id: student.student_code },
        });

        if (course) {
          // Actualizar curso existente
          course.group_id = id;
          await course.save();
        } else {
          // Crear nuevo curso
          await Courses.create({
            student_id: student.student_code,
            grade: 0,
            status: "pendiente",
          });
        }
      });

      await Promise.all(promises);

      return res
        .status(200)
        .json({ message: "Estudiantes agregados al grupo exitosamente" });
    } catch (error) {
      console.error("Error al agregar estudiantes al grupo:", error);
      return res
        .status(500)
        .json({ message: `Error al agregar estudiantes: ${error.message}` });
    }
  }

  // Controlador para guardar las notas de los estudiantes
  async saveStudentGrade(req, res) {
    try {
      const { student_code, idCourse, grade } = req.body;

      // Validar si el estudiante pertenece al curso
      const student = await Student.findByPk(student_code);
      if (!student || student.student_code !== idCourse) {
        return res.status(400).json({
          message: "El estudiante no está registrado en este curso",
        });
      }

      // Actualizar o crear el registro de nota en `Courses`
      await Courses.upsert({
        user_id: student_code,
        grade,
      });

      res.status(200).json({ message: "Nota guardada correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al guardar la nota" });
    }
  }

  /*  async getStudentsByGroup(req, res) {
    const { groupId } = req.params;

    try {
      // Verificar si el grupo existe
      const group = await Group.findByPk(groupId);
      if (!group) {
        return res.status(404).json({ message: "Grupo no encontrado" });
      }

      // Obtener los estudiantes del grupo junto con sus calificaciones
      const students = await Student.findAll({
        where: { group_id: groupId },
        attributes: ["student_code", "student_name"],
        include: [
          {
            model: Courses,
            attributes: ["grade"],
            required: false, // Incluye estudiantes incluso si no tienen calificaciones
            where: { group_id: groupId },
          },
        ],
      });

      // Mapear los datos para formatearlos según lo esperado en el frontend
      const formattedStudents = students.map((student) => ({
        student_code: student.student_code,
        student_name: student.student_name,
        grade: student.Courses?.grade || null, // Asignar null si no tiene calificación
      }));

      return res.status(200).json({ students: formattedStudents });
    } catch (error) {
      console.error("Error al obtener los estudiantes del grupo:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  } */
}

module.exports = new GroupController();
