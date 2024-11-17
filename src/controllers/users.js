const User = require("../model/user.model");
const Student = require("../model/studens.model");
const Professor = require("../model/professors.model");
const { hashPassword } = require("./utils/passwordUtils");
const { sendEmail } = require("./utils/emailUtils");
const { generateToken } = require("../middlewares/jwtUtils");
const Programs = require("../model/program.model");
const { Sequelize } = require('sequelize');

const validateUniqueEmail = async (email) => {
  const existingUser = await User.findOne({ where: { email } });
  return existingUser ? false : true;
};

class UserController {
  async register(req, res) {
    const { name, studentCode, password, email, role, semestre, programa } =
      req.body;
    console.log("Datos recibidos:", req.body);
    try {
      // Verificar si el email ya está registrado
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: "El email ya está en uso." });
      }

      const hashedPassword = await hashPassword(password);

      const assignedRole = [
        "admin",
        "teacher",
        "adminStudent",
        "teacherStudent",
      ].includes(role)
        ? role
        : "student";

      const newUser = await User.create({
        name,
        studentCode,
        password: hashedPassword,
        email,
        role: assignedRole,
        isVerified: false,
      });

      // Crear registros específicos para cada tipo de usuario
      if (
        assignedRole === "student" ||
        assignedRole === "adminStudent" ||
        assignedRole === "teacherStudent"
      ) {
        await Student.create({
          student_code: studentCode,
          student_name: name,
          student_email: email,
          semestre: semestre,
          group_id: null, // Inicialmente nulo
          payment: null, // Puedes agregar lógica adicional si se requiere
          program_id: programa,
          gradeHistory: null,
        });
      } else if (assignedRole === "teacher") {
        await Professor.create({
          name,
          email,
        });
      }

      /* // Generar token de verificación
      const verificationToken = generateToken({ userId: newUser._id }, '24h');

      // Enviar email de verificación
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-account/${verificationToken}`;
      await sendEmail({
        to: newUser.email,
        subject: 'Verifica tu cuenta',
        text: `Para verificar tu cuenta, haz clic en este enlace: ${verificationUrl}`
      }); */

      return res.status(201).json({
        message: "Usuario creado. Por favor",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error("Error en el registro:", error);
      /* reversar creacion en la BD */
      await User.destroy({ where: { email } });
      return res
        .status(500)
        .json({ message: "Error al crear el usuario.", error: error.message });
    }
  }

  async getByCode(req, res) {
    const { studentCode } = req.params;

    try {
      const user = await User.findOne({ where: { studentCode } });
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }
      return res.status(200).json({ message: "Usuario encontrado.", user });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error al buscar el usuario.", error });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      console.log("Usuarios encontrados:", users); // Log para verificar los usuarios encontrados
      return res.status(200).json({ message: "Usuarios encontrados.", users });
    } catch (error) {
      console.error("Error en getAllUsers:", error);
      return res.status(500).json({
        message: "Error al buscar los usuarios.",
        error: error.message,
      });
    }
  }

  async getAllStudents(req, res) {
    try {
      const students = await User.findAll({ where: { role: "student" } });
      return res
        .status(200)
        .json({ message: "Estudiantes encontrados.", students });
    } catch (error) {
      console.error("Error al buscar los estudiantes:", error);
      return res
        .status(500)
        .json({ message: "Error al buscar los estudiantes.", error });
    }
  }

  async getProgramas(req, res) {
    try {
      const programas = await Programs.findAll();
      return res.status(200).json(programas);
    } catch (error) {
      console.error("Error al obtener los programas:", error);
      return res.status(500).json({ message: "Error al obtener programas." });
    }
  }

  async getEnrollmentCountByProgram(req, res) {
    try {
        const enrollmentCount = await Student.findAll({
            attributes: [
                'program_id',
                [Sequelize.fn('COUNT', Sequelize.col('program_id')), 'studentCount'],
            ],
            include: [
                {
                    model: Programs,
                    attributes: ['name'], // Get program name
                },
            ],
            group: ['program_id', 'Program.id'], // Group by program_id and Program ID
        });

        // Transform the response to an array of objects with 'program' and 'count'
        const formattedData = enrollmentCount.map(item => ({
            program: item.Program.name,
            count: item.dataValues.studentCount,
        }));

        return res.status(200).json(formattedData);
    } catch (error) {
        console.error("Error al obtener la cantidad de estudiantes por programa:", error);
        return res.status(500).json({
            message: "Error al obtener la cantidad de estudiantes por programa.",
            error: error.message,
        });
    }
}

  async updateUser(req, res) {
    const { email, name, studentCode, password, role, newEmail } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }

      if (newEmail && newEmail !== user.email) {
        const isUnique = await validateUniqueEmail(newEmail);
        if (!isUnique) {
          return res
            .status(409)
            .json({ message: "El nuevo email ya está en uso." });
        }
        user.email = newEmail;
      }

      // Encriptar la contraseña únicamente si se proporciona
      let hashedPassword;
      if (password) {
        hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
      }

      // Only update fields if they are provided
      if (name !== undefined) user.name = name;
      if (studentCode !== undefined) user.studentCode = studentCode;
      if (role !== undefined) user.role = role;

      await user.save();

      return res.status(200).json({ message: "Usuario actualizado.", user });
    } catch (error) {
      return res.status(500).json({
        message: "Error al actualizar el usuario.",
        error: error.message,
      });
    }
  }

  async deleteUser(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }

      await user.destroy();

      return res.status(204).json({ message: "Usuario eliminado." });
    } catch (error) {
      return res.status(500).json({
        message: "Error al eliminar el usuario.",
        error: error.message,
      });
    }
  }
}

module.exports = new UserController();
