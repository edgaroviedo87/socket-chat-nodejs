const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Usuario, Category, Product} = require('../models');

const collectionsAllowed = [
    'users',
    'categories',
    'products',
    'roles'
];

const searchUsers = async(term = '', res = response) => {

    const isMongoId = ObjectId.isValid( term );

    if (isMongoId) {

        const user = await Usuario.findById(term);

        res.json({
            results: (user) ? [ user ] : []
        });
    }
    
    const regex = new RegExp(term, 'i');

    const users = await Usuario.find({ 
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: users
    });
}

const searchCategories = async(term = '', res = response) => {
    
    const isMongoId = ObjectId.isValid( term );

    if (isMongoId) {

        const category = await Category.findById(term);

        res.json({
            results: (category) ? [ category ] : []
        });
    }
    
    const regex = new RegExp(term, 'i');

    const categories = await Category.find({ name: regex, status: true });

    res.json({
        results: categories
    });    
}

const searchProducts = async(term = '', res = response) => {
    
    const isMongoId = ObjectId.isValid( term );

    if (isMongoId) {

        const product = await Product.findById(term).populate('category', 'name');

        res.json({
            results: (product) ? [ product ] : []
        });
    }
    
    const regex = new RegExp(term, 'i');

    const products = await Product.find({ name: regex, status: true }).populate('category', 'name');

    res.json({
        results: products
    });    
}



const search = (req, res = response) => {
    
    const { collection, term } = req.params;

    if (!collectionsAllowed.includes(collection)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ collectionsAllowed }`
        });
    }    

    switch (collection) {
        case 'users':
            searchUsers(term, res);
            break;

        case 'categories':
            searchCategories(term, res);
            break;

        case 'products':
            searchProducts(term, res);
            break;
    
        default:
            res.status(500).json({
                msg: 'Falta terminar este codigo'
            });
            break;
    }
}

module.exports = {
    search
}