const Group = require("../model/groups.model");
const Professor = require("../model/professors.model");

class GroupController {
  async register(req, res) {
    const { name, grupo, nivel, idioma, profesor } = req.body;
    try {
      // Create the new group entry
      const newGroup = await Group.create({
        name,
        grupo,
        nivel,
        idioma,
        profesor: null,
      });

      // Associate group with the professor if required
      /* const existingProfessor = await Professor.findOne({
        where: { name: profesor },
      });
      if (existingProfessor) {
        // Assuming there is a relation between Group and Professor
        await newGroup.setProfessor(existingProfessor);
      } else {
        // If no matching professor is found, create one
        const newProfessor = await Professor.create({ name: profesor });
        await newGroup.setProfessor(newProfessor);
      } */

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
        include: Professor, // Include associated professor if any
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
      const professor = await Professor.findOne({
        where: { name: profesorName },
      });

      if (!professor) {
        return res.status(404).json({ message: "Profesor no encontrado." });
      }

      // Fetch groups associated with the professor
      const groups = await Group.findAll({
        where: { profesor: professor.name },
        include: Professor, // Include associated professor if any
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
      const professors = await Professor.findAll(); // Asegúrate de que la consulta sea correcta
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
}

module.exports = new GroupController();
