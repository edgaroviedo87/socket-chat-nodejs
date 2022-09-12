const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");

const { subirArchivo } = require("../helpers");
const { Usuario, Product } = require('../models');

const uploadFile = async(req, res = response) => {

    try {
        
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({ nombre });

    } catch (msg) {
        res.status(400).json({ msg });
    }
}

const updateImage = async(req, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;
        
        case 'products':
            modelo = await Product.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    // Limpiar imagenes previas
    if (modelo.img) {
        // Hay que borrar la imagen del servidor
        const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
        }
    }
    
    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);
}

const updateImageCloudinary = async(req, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;
        
        case 'products':
            modelo = await Product.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    // Limpiar imagenes previas
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [ public_id ] = nombre.split('.');

        cloudinary.uploader.destroy(public_id);

    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;

    await modelo.save();
    
    res.json(modelo);
}

const mostrarImagen = async(req, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;
        
        case 'products':
            modelo = await Product.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    // Limpiar imagenes previas
    if (modelo.img) {
        
        //if (fs.existsSync(modelo.img)) {
            return res.json({
                img: modelo.img
            });
        //}
    }
    
    return res.sendFile(path.join(__dirname, '../assets/no-image.jpg'));
}

module.exports = {
    uploadFile,
    updateImage,
    updateImageCloudinary,
    mostrarImagen
}