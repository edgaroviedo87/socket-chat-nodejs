const { response, request } = require('express');

const { Category } = require('../models');


const getCategories = async(req, res) => {
    
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query) 
            .populate('usuario', 'nombre')           
            .skip(Number(from))
            .limit(Number(limit))            
    ]);
    
    res.json({
        total,
        categories
    });
}

const getCategory = async(req = request, res) => {

    const { id } = req.params;
    const category = await Category.findById(id).populate('usuario', 'nombre');

    res.json(category);
}

const createCategory = async(req, res = response) => {
    
    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });

    // Validar si ya existe la categoria
    if ( categoryDB ) {
        return res.status(400).json({
            msg: `La categoría ${ categoryDB.name } ya existe`
        })
    }

    // Generar los datos a guardar
    const data = {
        name,
        usuario: req.usuario._id
    }

    const category = new Category( data );

    // Guardar en DB
    await category.save();

    res.status(201).json( category );
}

const updateCategory = async(req, res) => {

    const { id } = req.params;
    const {status, usuario, ...data} = req.body;

    data.name = data.name.toUpperCase();
    data.usuario = req.usuario._id
    
    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
        category
    });
}

const deleteCategory = async(req, res) => {
    
    const { id } = req.params;
    const {_id, ...resto} = req.usuario;

    // Borrado lógico
    const category = await Category.findByIdAndUpdate(id, { status: false, usuario: _id }, { new: true });
    
    res.json(category);
}


module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}