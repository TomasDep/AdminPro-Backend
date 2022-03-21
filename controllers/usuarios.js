const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {
  const usuarios = await Usuario.find();

  res.json({
    ok: true,
    message: 'Usuarios encontrados',
    usuarios
  });
}

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        message: 'El correo ya está registrado'
      });
    }

    const usuario = new Usuario(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // Guardar usuario
    await usuario.save();

    // Generar JWT
    const token = await generarJWT(usuario.id);
    
    res.json({
      ok: true,
      message: 'Usuario creado',
      token,
      usuario
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: 'Error inesperado... revisar los logs'
    })
  }
}

const actualizarUsuario = async (req, res = response) => {
  const uid = req.params.id;
  
  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        message: 'No existe un usuario por ese id'
      });
    }

    // Actualizaciones
    const { password, goole, email, ...campos } = req.body;

    if (usuarioDB !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if ( existeEmail ) {
        return res.status(400).json({
          ok: false,
          message: 'Ya existe un usuario con ese email'
        });
      }
    }

    campos.email = email;
    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

    res.json({
      ok: true,
      usuarioActualizado
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: 'Error inesperado'
    });
  }
}

const borrarUsuario = async (req, res = response) => {
  try {
    const uid = req.params.id;

    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        message: 'No existe un usuario por ese id'
      });
    }

    await Usuario.findByIdAndDelete(uid);

    res.json({
      ok: true,
      message: 'Usuario eliminado'
    })
  } catch(error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: 'Error inesperado'
    });
  }
}

module.exports = {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario
}