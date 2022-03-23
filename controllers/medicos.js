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

const actualizarMedicos = async (req, res = response) => {
  const medicoId = req.params.id;
  const uid = req.uid;

  try {
    const medico = await Medico.findById(medicoId);

    if (!medico) {
      return res.status(404).json({
        ok: true,
        message: 'Medico no encontrado por id'
      });
    }
    
    const cambiosMedico = {
      ...req.body,
      usuario: uid
    }

    const medicoActualizado = await Medico.findByIdAndUpdate(medicoId, cambiosMedico, { new: true });

    res.json({
      ok: true,
      message: 'Medico actualizado',
      medico: medicoActualizado
    }) ;
  } catch (error) {
    console.log(error);
    res.json({
      ok: false,
      message: 'Error actualizado... revisar logs'
    });
  }

}

const borrarMedicos = async (req, res = response) => {
  const medicoId = req.params.id;

  try {
    const medico = await Medico.findById(medicoId);

    if (!medico) {
      return res.status(404).json({
        ok: false,
        message: 'Medico no encontrado por id'
      });
    }
  
    await Medico.findByIdAndDelete(medicoId);

    res.json({
      ok: true,
      message: 'Medico borrado'
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
  getMedicos,
  crearMedicos,
  actualizarMedicos,
  borrarMedicos
}