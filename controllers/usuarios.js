const { response, request } = require('express');
const bcriptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async(req = request, res = response) => {

    //const { nombre, apellido, edad } = req.query;
    const { limit = 3, desde = 0 } = req.query;
    const query = { estado: true };

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limit));

    // const total = await Usuario.countDocuments(query);

    // const resp = await Promise.all([
    //     Usuario.countDocuments(query),
    //     Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limit))
    // ]);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limit))
    ]);

    res.json({
        //resp
        // total,
        // usuarios
        total,
        usuarios
    });
}

const usuariosPost = async(req, res) => {

    const { nombre, correo, password, role } = req.body;
    const usuario = new Usuario({ nombre, correo, password, role });

    // Encriptar la password
    const salt = bcriptjs.genSaltSync();
    usuario.password = bcriptjs.hashSync(password, salt);

    // Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async(req = request, res) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if (password) {
        // Encriptar la password
        const salt = bcriptjs.genSaltSync();
        resto.password = bcriptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json({
        usuario
    });
}

const usuariosDelete = async(req, res) => {

    const { id } = req.params;

    // Borrado fisico
    // const usuario = await Usuario.findByIdAndDelete(id);

    // Borrado logico
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    const usuarioAutenticado = req.usuario;

    res.json({ usuario, usuarioAutenticado });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,    
    usuariosDelete
}