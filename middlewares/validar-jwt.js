const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario');

const validarJWT = (req, res, next) => {
  // Leer token
  const token = req.header('x-token');
  if (!token) {
    return res.status(401).json({
      ok: false,
      message: 'No hay token en la peticion'
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      ok: false,
      message: 'Token no valido'
    });
  }
}

const validarAdminRole = async (req, res, next) => {
  const uid = req.uid;
  const id = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        message: 'El usuario no existe'
      });
    }
    
    if (usuarioDB.role === 'ADMIN_ROLE' || uid === id) {
      next();
    } else {
      return res.status(403).json({
        ok: false,
        message: 'Acción no autorizada'
      });
    }
  } catch(error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: 'Error inesperado... revisar logs'
    });
  }
}

module.exports = {
  validarJWT,
  validarAdminRole
}