const { response } = require('express');

const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers');
const { googleVerify } = require('../helpers/google-verify');


const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({
                msg: 'El correo/password no son correctos - correo'
            });
        }

        // Si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El correo/password no son correctos - estado: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(`${password}`, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'El correo/password no son corretos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}

const googleSignIn = async(req, res = response) => {

    const { id_token } = req.body;
    
    try {

        const { nombre, img, correo } = await googleVerify(id_token);

        // Verificar si ya existe el correo del usuario
        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {

            // Must create the user
            const data = {
                nombre,
                correo,
                password: ':P',
                role: 'USER_ROLE',
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Verify user is active
        if (!usuario.estado) {            
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token de google no se pudo verificar'
        });
    }
}

const renovarToken = async(req, res = response) => {

    const {usuario} = req;

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token
    });
}

module.exports = {
    login,
    googleSignIn,
    renovarToken
}