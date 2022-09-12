const { Category, Role, Usuario, Product } = require('../models');

const esRoleValido = async(role = '') => {

    const existeRol = await Role.findOne({ role });
    if (!existeRol) {
        throw new Error(`El role ${ role } no está registrado en la BD`);
    }
}

const emailExiste = async(correo = '') => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });

    if (existeEmail) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorID = async(id = '') => {

    // Verificar si el usuario existe
    const existeUsuario = await Usuario.findById(id);

    if (!existeUsuario) {
        throw new Error(`El ID: ${ id }, no está registrado`);
    }
}

const existCategoryById = async(id = '') => {
    
    const existeCategoria = await Category.findById(id);

    if (!existeCategoria) {
        throw new Error('La categoria no está registrada');
    }
}

const existProductById = async(id = '') => {

    const product = await Product.findById(id);

    if (!product) {
        throw new Error('El producto no está registrado');
    }
}

const coleccionesPermitidas = async(coleccion = '', colecciones = [] ) => {

    if (!colecciones.includes(coleccion)) {
        throw new Error(`La colección ${coleccion} no es permitida`)
    }

    return true;

}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorID,
    existCategoryById,
    existProductById,
    coleccionesPermitidas,
}