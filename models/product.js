const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Category = require('./category');

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "The title is required!"]
    },
    desc: {
      type: String,
      required: [true, "The product description is required."],
      minlength: [10, "The product description must be at least 10 characters long."]
    },
    imageUrl: {
      type: [
        {
          type: String,
          maxlength: [255, "Each URL must have a maximum length of 255 characters."]
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

