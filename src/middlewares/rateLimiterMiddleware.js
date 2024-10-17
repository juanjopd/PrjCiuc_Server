const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 solicitudes por ventana por IP
  message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo más tarde.'
});

module.exports = { rateLimiter };