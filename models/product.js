const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'Nombre del producto es requerido'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: { type: String },
    available: { type: Boolean, default: true },
    img: {
        type: String
    },
});

ProductSchema.methods.toJSON = function() {
    
    const {__v, status, ...data } = this.toObject();    
    
    return data;
}

module.exports = model('Product', ProductSchema);