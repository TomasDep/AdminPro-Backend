const { response } = require('express');

const Hospital = require('../models/hospital');

const getHospitales = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;  

  const [hospitales, total] = await Promise.all([
    Hospital.find()
            .populate('usuario', 'nombre')
            .skip(desde)
            .limit(5),
    Hospital.count()
  ]);

  res.json({
    ok: true,
    message: 'Lista de hospitales',
    hospitales,
    total
  });
}

const getTotalHospitales = async (req, res) => {
  const hospitales = await Hospital.find().count();

  res.json({
    ok: true,
    message: 'Total de hospitales',
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

const actualizarHospitales = async (req, res = response) => {
  const hospitalId = req.params.id;
  const uid = req.uid;

  try {
    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({
        ok: true,
        message: 'Hospital no encontrado por id'
      });
    }

    const cambiosHospital = {
      ...req.body,
      usuario: uid
    }

    const hospitalActualizado = await Hospital.findByIdAndUpdate(hospitalId, cambiosHospital, { new: true });

    res.json({
      ok: true,
      message: 'Hospital actualizado',
      hospital: hospitalActualizado
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: 'Error inesperado... revisar logs'
    });
  }
}

const borrarHospitales = async (req, res = response) => {
  const hospitalId = req.params.id;

  try {
    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({
        ok: true,
        message: 'Hospital no encontrado por id'
      });
    }

    await Hospital.findByIdAndDelete(hospitalId);

    res.json({
      ok: true,
      message: 'Hospital elimiando',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: 'Error inesperado... revisar logs'
    });
  }
}

module.exports = {
  getHospitales,
  getTotalHospitales,
  crearHospitales,
  actualizarHospitales,
  borrarHospitales
}