const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        isSold: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);

