const User = require('../model/user.model');
const bcrypt = require('bcrypt');

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

    try {
      // Verificar si el email ya está registrado (si existe, devolver error)
      const isUnique = await validateUniqueEmail(email);
      if (!isUnique) {
        return res.status(409).json({ message: 'El email ya está en uso.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10); // Encriptar la contraseña

      const newUser = await User.create({
        name,
        studentCode,
        password: hashedPassword,
        email,
        role: roleRegiter
      });

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
      return res.status(500).json({ message: 'Error al buscar los usuarios.', error });
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

}

module.exports = new UserController();
