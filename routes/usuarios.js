/**
 * Ruta: /api/usuarios
 */
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarJWT, validarAdminRole } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [validarJWT, validarAdminRole], getUsuarios);
router.post('/', [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'La contraseña es obligatorio').not().isEmpty(),
  check('email', 'El email es obligatorio').isEmail(),
  validarCampos
], crearUsuario);
router.put('/:id', [
  validarJWT,
  validarAdminRole,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'El email es obligatorio').isEmail(),
  check('role', 'El role es obligatorio').not().isEmpty(),
  validarCampos
], actualizarUsuario);
router.delete('/:id', [validarJWT, validarAdminRole], borrarUsuario);

module.exports = router;