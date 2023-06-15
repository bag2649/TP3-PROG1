const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'The category name is required.'],
        maxlength: [50, 'The category name cannot exceed 50 characters.']
    },
    description: {
        type: String,
        required: false,
        maxlength: [255, 'The category description cannot exceed 255 characters.']
    }
});

module.exports = mongoose.model('Category', categorySchema);
