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
  check(['email', 'password'], 'Las credenciales no son validas').not().notEmpty(),
  check('email', 'No es un email valido').isEmail(),
  validarCampos
], login);
router.post('/google', [
  check('token', 'El token de google es obligatorio').not().notEmpty(),
  validarCampos
], googleSignIn);
router.get('/renew', validarJWT, renewToken);

module.exports = router;