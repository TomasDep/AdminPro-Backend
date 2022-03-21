const jwt = require('jsonwebtoken')

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

module.exports = {
  validarJWT
}