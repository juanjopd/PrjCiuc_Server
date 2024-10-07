/* midewalres for is teacher and is admin */
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
  try {
    const user = await User.findOne({ where: { id: req.user.email } });
    if (user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error al verificar permisos.' });
  }
};

module.exports = { isTeacher, isAdmin };