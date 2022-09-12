const { request, response } = require("express");

const Category = require("../models/category");

const validateCategory = async(req, res, next) => {

    const idCategory = req.body.category;

    if (idCategory) {
        const category = await Category.findById(idCategory);

        if (!category) {            
            return res.status(404).json({
                msg: 'Id de categoría no es válido'
            });
        }
    }

    next();    
}

module.exports = {
    validateCategory
}