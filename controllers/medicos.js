const { response } = require('express');

const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {
  
  const medicos = await Medico.find()
                              .populate('usuario', 'nombre')
                              .populate('hospital', 'nombre')

  res.json({
    ok: true,
    message: 'Lista de medicos',
    medicos
  }) 
}

const crearMedicos = async (req, res = response) => {
  const uid = req.uid;
  const medico = new Medico({ usuario: uid, ...req.body });

  try {
    
    const medicoDB = await medico.save();

    res.json({
      ok: true,
      message: 'Medico creado',
      medico: medicoDB
    }) 
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: true,
      message: 'Error inesperado... revise los logs'
    });
  }
}

const actualizarMedicos = (req, res = response) => {
  res.json({
    ok: true,
    message: 'Medico actualizado'
  }) 
}

const borrarMedicos = (req, res = response) => {
  res.json({
    ok: true,
    message: 'Medico borrado'
  }) 
}

module.exports = {
  getMedicos,
  crearMedicos,
  actualizarMedicos,
  borrarMedicos
}