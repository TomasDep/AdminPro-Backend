const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar email
    const usuarioDB = await Usuario.findOne({ email });
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        message: 'Las credenciales no son validas'
      })
    }

    // Verificar Contraseña
    const validPassword = bcryptjs.compareSync( password, usuarioDB.password );
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        message: 'Las credenciales no son validas'
      })
    }

    // Generar JWT
    const token = await generarJWT(usuarioDB.id);

    res.json({
      ok: true,
      token,
      message: 'Usuario autenticado'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: 'Error inesperado'
    });
  }
}

module.exports = {
  login
}