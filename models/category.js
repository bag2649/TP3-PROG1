const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
      type: String,
      required: [true, 'Le nom de la catégorie est requis.'],
      maxlength: [50, 'Le nom de la catégorie ne peut pas dépasser 50 caractères.']
    },
    description: {
      type: String,
      required: false,
      maxlength: [255, 'La description de la catégorie ne peut pas dépasser 255 caractères.']
    }
  });
  
  module.exports = mongoose.model('Category', categorySchema);