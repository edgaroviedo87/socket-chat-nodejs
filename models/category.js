const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
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
});

CategorySchema.methods.toJSON = function() {
    
    const {__v, status, ...data } = this.toObject();    
    
    return data;
}

module.exports = model('Category', CategorySchema);