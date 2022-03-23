/**
 * Path: '/api/login'
 */
const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/', [
  check('email', 'El email es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria').not().notEmpty(),
  validarCampos
], login);
router.post('/google', [
  check('token', 'El token de google es obligatorio').not().notEmpty(),
  validarCampos
], googleSignIn);
router.get('/renew', validarJWT, renewToken);

module.exports = router;