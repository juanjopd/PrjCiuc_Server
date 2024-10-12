const  User  = require('../model/user.model');

const isTeacher = async (req, res, next) => {
  try {
    const {email} = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Se requiere el email del usuario.' });
    }

    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    
    if (user.role === 'teacher' || user.role === 'admin') {
      next();
    }
    else {
      return res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta.' });
    }
  } catch (error) {
    console.error('Error en middleware isTeacher:', error);
    return res.status(500).json({ message: 'Error al verificar permisos.', error: error.message });
  }
}

const isAdmin = async (req, res, next) => {
  try {
    // Asumimos que el email del usuario se pasa como query parameter
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Se requiere el email del usuario.' });
    }

    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: 'No se encontró el usuario, No tiene permisos para acceder a esta ruta.' });
    }
    
    if (user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta.' });
    }
  } catch (error) {
    console.error('Error en middleware isAdmin:', error);
    return res.status(500).json({ message: 'Error al verificar permisos.', error: error.message });
  }
};


module.exports = { isTeacher, isAdmin };