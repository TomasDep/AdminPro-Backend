const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const actualizarImagen = require('../helpers/actualizar-imagen');

const fileUploads = (req, res = response) => {

  const tipo = req.params.tipo;
  const id = req.params.id;

  // Validar tipo
  const tipoValidos = ['hospitales', 'medicos', 'usuarios'];
  if (!tipoValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      message: 'No es un medico, hospital u usuario (tipo)'
    });
  }

  // Validar de que exista un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      message: 'No hay ningun archivo'
    });
  }
  
  // Procesar imagen
  const file = req.files.imagen;
  const nombreCortado = file.name.split('.');
  const extensionArchivo = nombreCortado[nombreCortado.length - 1];

  // Validar extension
  const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      ok: false,
      message: 'No es una extension permitida'
    });
  }

  // Generar el nombre del archivo
  const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

  // Path para guardar la imagen
  const path = `./uploads/${ tipo }/${ nombreArchivo }`

  // Mover la imagen
  file.mv(path, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'Error al mover la imagen'
      });
    }

    // Actualizar base de datos
    actualizarImagen(tipo, id, nombreArchivo);

    res.json({
      ok: true,
      message: 'Archivo subido',
      nombreArchivo
    })
  });

}

const retornaImagen = (req, res = response) => {
  const tipo = req.params.tipo;
  const image = req.params.image;

  const pathImg = path.join(__dirname, `../uploads/${ tipo }/${ image }`);
  
  // imagen por defecto
  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
    res.sendFile(pathImg);
  }
}

module.exports = {
  fileUploads,
  retornaImagen
}