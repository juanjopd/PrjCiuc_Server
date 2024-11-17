const Group = require("../model/groups.model");
const Professors = require("../model/professors.model");
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
}

module.exports = new GroupController();
