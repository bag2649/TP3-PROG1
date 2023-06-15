const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user'); 
const Category = require('./category'); 


const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre est requis !"]
    },
    desc: {
      type: String,
      required: [true, "L'product est requis"],
      minlength: [10, "L'product doit contenir au moins 10 caractères"]
    },
    imageUrl: {
      type: [
        {
          type: String,
          maxlength: [255, "Chaque URL doit avoir une longueur maximale de 255 caractères"]
        }
      ]
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    isSold: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
