const { User } = require('../model/user.model');

const isTeacher = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.email } });
    if (user.role === 'teacher') {
      next();
    } else {
      return res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error al verificar permisos.' });
  }
};

const isAdmin = async (req, res, next) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ where:  req.body.email });
    
    // Verificar si el usuario fue encontrado
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    
    if (user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error al verificar permisos.', error });
  }
};

module.exports = { isTeacher, isAdmin };