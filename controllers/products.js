const { response, request } = require('express');

const { Product } = require('../models');


const getProducts = async(req, res) => {
    
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query) 
            .populate('usuario', 'nombre')           
            .populate('category', 'name')           
            .skip(Number(from))
            .limit(Number(limit))            
    ]);
    
    res.json({
        total,
        products
    });
}

const getProductById = async(req = request, res) => {

    const { id } = req.params;
    const product = await Product.findById(id)
                            .populate('usuario', 'nombre')
                            .populate('category', 'name');

    res.json(product);
}

const createProduct = async(req = request, res = response) => {
    
    const {status, usuario, ...body} = req.body;

    const productDB = await Product.findOne({ name: body.name });

    // Validar si ya existe la categoria
    if ( productDB ) {
        return res.status(400).json({
            msg: `El producto ${ productDB.name } ya existe`
        })
    }

    // Generar los datos a guardar
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        usuario: req.usuario._id,
    }

    const product = new Product( data );

    // Guardar en DB
    await product.save();

    res.status(201).json( product );
}

const updateProduct = async(req, res) => {

    const { id } = req.params;
    const {status, usuario, ...data} = req.body;

    if (data.name) {
        data.name = data.name.toUpperCase();
    }

    data.usuario = req.usuario._id
    
    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
        product
    });
}

const deleteProduct = async(req, res) => {
    
    const { id } = req.params;
    const {_id, ...resto} = req.usuario;

    // Borrado lógico
    const product = await Product.findByIdAndUpdate(id, { status: false, usuario: _id }, { new: true });
    
    res.json(product);
}


module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}