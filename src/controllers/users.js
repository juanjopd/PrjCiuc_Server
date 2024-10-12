const User = require('../model/user.model');
const Student = require('../model/studens.model');
const Professor = require('../model/professors.model');
const { hashPassword } = require('./utils/passwordUtils')

const validateUniqueEmail = async (email) => {
  const existingUser = await User.findOne({ where: { email } });
  return existingUser ? false : true;
};

class UserController {

  async register(req, res) {
    const { name, studentCode, password, email, role } = req.body;

    // Validaciones
    if (!name || !password || !email) {
      return res.status(400).json({ message: 'Faltan datos requeridos.' });
    }

    const roleRegiter = role === 'admin' || role === 'teacher' ? role : 'student';
    
    if (role === 'student') {
      if (!studentCode) {
        return res.status(400).json({ message: 'Falta el codigo del estudiante.' });
      }
    }

    try {
      // Verificar si el email ya está registrado (si existe, devolver error)
      const isUnique = await validateUniqueEmail(email);
      if (!isUnique) {
        return res.status(409).json({ message: 'El email ya está en uso.' });
      }

      const hashedPassword = await hashPassword(password) // Encriptar la contraseña

      const newUser = await User.create({
        name,
        studentCode,
        password: hashedPassword,
        email,
        role: roleRegiter
      });

      if (role === 'student') {
        const newStudent = await Student.create({
          student_code: studentCode,
          student_name: name,
          student_email: email,
          group_id: null,
          payment: null,
          carrerProgram: null,
          gradeHistory: null,
        });
      }

      if (role === 'teacher') {
        const newStudent = await Professor.create({
          name,
          email,
        });
      }

      return res.status(201).json({ message: 'Usuario creado.', user: newUser });
    } catch (error) {
      return res.status(500).json({ message: 'Error al crear el usuario.', error });
    }
  }

  async getByCode(req, res) {
    const { studentCode } = req.params;

    try {
      const user = await User.findOne({ where: { studentCode } });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
      return res.status(200).json({ message: 'Usuario encontrado.', user });
    } catch (error) {
      return res.status(500).json({ message: 'Error al buscar el usuario.', error });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      return res.status(200).json({ message: 'Usuarios encontrados.', users });
    } catch (error) {
      console.error('Error en getAllUsers:', error);
      return res.status(500).json({ message: 'Error al buscar los usuarios.', error: error.message });
    }
  }

  async getAllStudents(req, res) {
    try {
      const students = await User.findAll({ where: { role: 'student' } });
      return res.status(200).json({ message: 'Estudiantes encontrados.', students });
    } catch (error) {
      return res.status(500).json({ message: 'Error al buscar los estudiantes.', error });
    }
  }

  async updateUser(req, res) {
    const { email, name, studentCode, password, role, newEmail } = req.body;

    try {
      const user = await User.findOne({ where: { email: newEmail || email } });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      if (newEmail && newEmail !== user.email) {
        const isUnique = await validateUniqueEmail(newEmail);
        if (!isUnique) {
          return res.status(409).json({ message: 'El nuevo email ya está en uso.' });
        } 
        user.email = newEmail;
      }

      const hashedPassword = await hashPassword(password) // Encriptar la contraseña

      // Only update fields if they are provided
      if (name !== undefined) user.name = name;
      if (studentCode !== undefined) user.studentCode = studentCode;
      if (password !== undefined) user.password = hashedPassword;
      if (role !== undefined) user.role = role;

      await user.save();

      return res.status(200).json({ message: 'Usuario actualizado.', user });
    } catch (error) {
      return res.status(500).json({ message: 'Error al actualizar el usuario.', error: error.message });
    }
  }

  async deleteUser(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      await user.destroy();

      return res.status(204).json({ message: 'Usuario eliminado.' });
    } catch (error) {
      return res.status(500).json({ message: 'Error al eliminar el usuario.', error: error.message });
    }
  }

}

module.exports = new UserController();
