const Usuario = require('../models/usuario')

const getUsuarios = async (request, response) => {
  const usuarios = await Usuario.find();

  response.json({
    ok: true,
    message: 'Usuarios encontrados',
    usuarios
  });
}

const crearUsuario = async (request, response) => {
  const { email, password, nombre } = request.body;

  const usuario = new Usuario(request.body);

  await usuario.save();

  response.json({
    ok: true,
    message: 'Usuario creado',
    usuario
  });
}

module.exports = {
  getUsuarios,
  crearUsuario
}