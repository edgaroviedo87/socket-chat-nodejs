const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, isAdminRole, validateCategory } = require('../middlewares');

const { existProductById, existCategoryById } = require('../helpers/db-validators');

const { createProduct, 
        getProducts, 
        getProductById, 
        updateProduct,
        deleteProduct
} = require('../controllers/products');

const router = Router();

/*
 * {{url}}/api/products
 */

router.get('/', getProducts);


router.get('/:id', [
    check('id', 'Id de producto no válido').isMongoId(),
    check('id').custom(existProductById),
    validarCampos
], getProductById);


router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'Id de categoría no es válido').isMongoId(),
    check('category').custom(existCategoryById),
    validarCampos
], createProduct);


router.put('/:id', [
    validarJWT,
    //check('category', 'Id de categoría no es válido').isMongoId(),
    validateCategory,
    check('id').custom(existProductById),
    validarCampos
], updateProduct);


router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'Id de producto no válido').isMongoId(),
    check('id').custom(existProductById),
    validarCampos
], deleteProduct);

module.exports = router;