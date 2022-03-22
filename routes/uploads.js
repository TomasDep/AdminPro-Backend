/**
 * Path: 'api/uploads
 */
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { validarJWT } = require('../middlewares/validar-jwt');
const { fileUploads, retornaImagen } = require('../controllers/uploads');

const router = Router();

router.use(expressFileUpload());

router.put('/:tipo/:id', validarJWT, fileUploads);
router.get('/:tipo/:image', retornaImagen);

module.exports = router;