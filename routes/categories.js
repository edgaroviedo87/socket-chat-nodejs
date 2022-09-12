const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, isAdminRole } = require('../middlewares');

const { existCategoryById } = require('../helpers/db-validators');

const { createCategory, 
        getCategories, 
        getCategory, 
        updateCategory,
        deleteCategory
} = require('../controllers/categories');

const router = Router();

/*
 * {{url}}/api/categories
 */

// Get all categories - public
router.get('/', getCategories);

// Get a specific category - public
router.get('/:id', [
    check('id', 'ID no válido').isMongoId(),
    check('id').custom(existCategoryById),
    validarCampos
], getCategory);

// Create a category - private - any person with a valid token
router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], createCategory);

// Update a category - private - any person with a valid token
router.put('/:id', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'ID no válido').isMongoId(),
    check('id').custom(existCategoryById),
    validarCampos
], updateCategory);

// Delete a category - Admin
router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'ID no válido').isMongoId(),
    check('id').custom(existCategoryById),
    validarCampos
], deleteCategory);

module.exports = router;