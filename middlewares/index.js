const validarCampos = require('../middlewares/validar-campos');
const validateCategory = require('../middlewares/validate-category');
const validarJWT = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');
const validarArchivo = require('../middlewares/validar-archivo');

module.exports = {
    ...validarCampos,
    ...validateCategory,
    ...validarJWT,
    ...validarRoles,
    ...validarArchivo,
}