const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req, res = response) => {
  const googleToken = req.body.token;

  console.log(googleToken);

  try {
    
    const { name, email, picture } = await googleVerify(googleToken);

    const usuarioDB = await Usuario.findOne({ email });
    let usuario;

    if (!usuarioDB) {
      // Si no existe el usuario
      usuario = new Usuario({
        nombre: name,
        email,
        password: '@@@',
        img: picture,
        google: true
      });  
    } else {
      // existe el usuario
      usuario = usuarioDB;
      usuario.google = true;
    }

    // Guardar en DB
    await usuario.save();

    // Generar JWT
    const token = await generarJWT(usuarioDB.id);
    
    res.json({
      ok: true,
      message: 'Google SignIn',
      token
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      ok: false,
      message: 'Token no es correcto',
      googleToken
    });
  }
}

const renewToken = async (req, res = response) => {
  const uid = req.uid;
  
  // Generar JWT
  const token = await generarJWT(uid);
  const usuario = await Usuario.findById(uid);

  res.json({
    ok: true,
    message: 'Token renovado',
    token,
    usuario
  });
}

module.exports = {
  login,
  googleSignIn,
  renewToken
}