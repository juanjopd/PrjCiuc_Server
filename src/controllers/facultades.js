const PDFDocument = require("pdfkit");
const Student = require("../model/studens.model");
const Programs = require("../model/program.model");
const Facultad = require("../model/facultad.model");
const path = require("path");
const { Op } = require("sequelize");

class facultadController {
  async getFaculties(req, res) {
    try {
      const faculties = await Facultad.findAll({
        attributes: ["id", "nombre"], // Solo selecciona los campos necesarios
      });
      res.status(200).json(faculties);
    } catch (error) {
      console.error("Error al obtener facultades:", error);
      res.status(500).json({ error: "Error al obtener las facultades" });
    }
  }

  async generateFacultyReport(req, res) {
    try {
      const { facultyId, year } = req.query;

      // Validar que facultyId esté presente
      if (!facultyId) {
        return res
          .status(400)
          .json({ error: "El ID de la facultad es obligatorio" });
      }

      // Validar que el año sea válido
      if (!year || isNaN(year)) {
        return res
          .status(400)
          .json({ error: "El año es obligatorio y debe ser válido" });
      }

      // Buscar la facultad con los programas y estudiantes creados en el año especificado
      const faculty = await Facultad.findOne({
        where: { id: facultyId },
        include: [
          {
            model: Programs,
            attributes: ["id", "name"],
            include: [
              {
                model: Student,
                attributes: ["id", "createdAt"],
                as: "Students", // Si usas un alias en la asociación
                where: {
                  createdAt: {
                    [Op.gte]: new Date(`${year}-01-01`),
                    [Op.lte]: new Date(`${year}-12-31`),
                  },
                },
              },
            ],
          },
        ],
      });

      // Verificar si la facultad existe
      if (!faculty) {
        return res.status(404).json({ error: "Facultad no encontrada" });
      }

      // Crear el PDF
      const doc = new PDFDocument({ margin: 30 });
      const fileName = `Reporte_${faculty.nombre}_${year}.pdf`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );

      doc.pipe(res);

      // Ruta absoluta de la imagen
      const imagePath = path.join(__dirname, "../assets/logoM.png");

      // Agregar imagen en la parte superior izquierda
      doc.image(imagePath, 30, 30, { width: 80 }); // Ajusta la ruta y tamaño

      // Título del reporte
      doc.fontSize(16).text(`Reporte de Facultad: ${faculty.nombre}`, 100, 30, {
        align: "center",
      });
      doc.fontSize(14).text(`Año: ${year}`, { align: "center" });
      doc.moveDown(2);

      // Crear tabla
      const tableTop = 100;
      let y = tableTop;

      // Encabezados de la tabla
      doc
        .fontSize(12)
        .text("Programa", 50, y, { bold: true })
        .text("Estudiantes inscritos", 300, y, { bold: true });
      y += 20;

      // Dibujar una línea debajo de los encabezados
      doc
        .moveTo(50, y - 5)
        .lineTo(550, y - 5)
        .stroke();

      // Agregar filas a la tabla
      faculty.Programs.forEach((program) => {
        const studentCount = program.Students ? program.Students.length : 0;

        // Restricción de ancho para el nombre del programa
        doc
          .fontSize(10)
          .text(program.name, 50, y, { width: 200, align: "left" }); // Nombre del programa

        // Asegurarse de que `y` se ajuste si el texto ocupa más de una línea
        const programHeight = doc.y - y; // Altura que ocupó el texto del programa

        // Número de estudiantes
        doc.text(studentCount.toString(), 300, y);

        // Actualizar `y` para la siguiente fila
        y += programHeight > 20 ? programHeight : 20;

        // Verificar si hay espacio en la página para la siguiente fila
        if (y > 700) {
          doc.addPage();
          y = 50;
        }
      });

      doc.end();
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      res.status(500).json({ error: "Error al generar el reporte" });
    }
  }
}

module.exports = new facultadController();
