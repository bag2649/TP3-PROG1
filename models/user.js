const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Cart = require('./cart');
const Product = require('./product');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email address is required."],
    unique: true,
    maxlength: [50, "Email address cannot exceed 50 characters."],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email address is not valid."]
  },
  lastName: {
    type: String,
    required: [true, "lastName is required."],
    minlength: [3, "lastName must be at least 3 characters long."],
    maxlength: [50, "lastName cannot exceed 50 characters."]
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: [6, "Password must be at least 6 characters long."]
  },
  firstName: {
    type: String,
    required: [true, "First name is required."],
    minlength: [3, "First name must be at least 3 characters long."],
    maxlength: [50, "First name cannot exceed 50 characters."]
  },
  city: {
    type: String,
    required: [true, "City is required."],
    maxlength: [50, "City name cannot exceed 50 characters."]
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  cart: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
});


module.exports = mongoose.model('User', userSchema);
