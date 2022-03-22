const { response } = require('express');

const Hospital = require('../models/hospital');

const getHospitales = async (req, res = response) => {

  const hospitales = await Hospital.find()
                                   .populate('usuario', 'nombre');

  res.json({
    ok: true,
    message: 'Lista de hospitales',
    hospitales
  });
}

const crearHospitales = async (req, res = response) => {
  const uid = req.uid;
  const hospital = new Hospital({ usuario: uid, ...req.body });
   
  try {
    
    const hospitalDB = await hospital.save();

    res.json({
      ok: true,
      message: 'Hospital creado',
      hospital: hospitalDB
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: 'Error inesperado... revisar logs'
    });
  }
}

const actualizarHospitales = (req, res = response) => {
  res.json({
    ok: true,
    message: 'Hospital actualizado'
  });
}

const borrarHospitales = (req, res = response) => {
  res.json({
    ok: true,
    message: 'Hospital borrado'
  });
}

module.exports = {
  getHospitales,
  crearHospitales,
  actualizarHospitales,
  borrarHospitales
}