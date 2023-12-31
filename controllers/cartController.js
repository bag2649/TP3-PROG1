"use strict";

const Cart = require('../models/cart')
const User = require('../models/user');
const Product = require('../models/product');


exports.getCart = (req, res, next) => {
  const userId = req.user.userId;

  Cart.findOne({ userId })
    .populate('products.productId', '_id title')
    .then(cart => {
      if (!cart) {
        return res.status(404).json({ message: "The cart was not found." });
      }

      if (cart.products.length === 0) {
        return res.status(404).json({ message: "The cart is empty." });
      }

      const products = cart.products.map(product => {
        return {
          _id: product.productId._id,
          title: product.productId.title
        };
      });

      res.status(200).json(products);
    })
    .catch(error => {
      res.status(500).json({ error: "An error occurred while fetching the cart.", error });
    });
};


exports.addToCart = (req, res, next) => {
  const userId = req.user.userId;
  const productId = req.body.productId;

  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      Cart.findOne({ userId })
        .then(cart => {
          if (!cart) {
            // Créer un nouveau panier pour l'utilisateur s'il n'existe pas
            return Cart.create({ userId })
              .then(newCart => {
                newCart.products.push({ productId: product._id, isSold: true });
                newCart.save()
                  .then(() => {
                    // Ajouter la référence du produit au tableau cart dans le modèle User
                    User.findByIdAndUpdate(userId, { $push: { cart: product._id } })
                      .then(() => {
                        // Mettre à jour la propriété isSold du produit
                        Product.findByIdAndUpdate(productId, { isSold: true })
                          .then(() => {
                            // Renvoyer l'ID du produit ajouté et un message de confirmation
                            res.status(200).json({ productId: product._id, message: 'Product added to cart successfully' });
                          })
                          .catch(err => {
                            res.status(500).json({ error: "An error occurred while updating the isSold property of the product" });
                          });
                      })
                      .catch(err => {
                        res.status(500).json({ error: "An error occurred while adding the product to the cart" });
                      });
                  });
              })
              .catch(err => {
                res.status(500).json({ error: "An error occurred while adding the product to the cart" });
              });
          }

          // Vérifier si le produit est déjà présent dans le panier
          const existingProduct = cart.products.find(p => p.productId.toString() === productId);

          if (existingProduct) {
            return res.status(409).json({ error: 'The product is already present in the cart' });
          }

          cart.products.push({ productId: product._id, isSold: true });
          cart.save()
            .then(() => {
              // Ajouter la référence du produit au tableau cart dans le modèle User
              User.findByIdAndUpdate(userId, { $push: { cart: product._id } })
                .then(() => {
                  // Mettre à jour la propriété isSold du produit
                  Product.findByIdAndUpdate(productId, { isSold: true })
                    .then(() => {
                      // Renvoyer l'ID du produit ajouté et un message de confirmation
                      res.status(200).json({ productId: product._id, message: 'Product added to cart successfully' });
                    })
                    .catch(err => {
                      res.status(500).json({ error: "An error occurred while updating the isSold property of the product" });
                    });
                })
                .catch(err => {
                  res.status(500).json({ error: "An error occurred while adding the product to the cart" });
                });
            })
            .catch(err => {
              res.status(500).json({ error: "An error occurred while adding the product to the cart" });
            });
        })
        .catch(err => {
          res.status(404).json({ error: 'The cart was not found' });
        });
    })
    .catch(err => {
      res.status(500).json({ error: 'An error occurred while fetching the product' });
    });
};



exports.removeFromCart = (req, res, next) => {
  const userId = req.user.userId;
  const productId = req.params.id;

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      Cart.findOne({ userId })
        .then(cart => {
          if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
          }

          const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

          if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in the cart' });
          }

          const removedProduct = cart.products[productIndex];
          cart.products.splice(productIndex, 1);

          cart.save()
            .then(savedCart => {
              // Mettre à jour la propriété 'cart' de l'utilisateur dans la base de données
              user.cart = savedCart.products.map(item => item.productId);
              user.save()
                .then(() => {
                  res.status(200).json({ productId: removedProduct.productId, message: 'Product removed from cart successfully' });
                })
                .catch(err => {
                  res.status(500).json({ error: 'An error occurred while updating the user\'s cart' });
                });
            })
            .catch(err => {
              res.status(500).json({ error: 'An error occurred while removing the product from the cart' });
            });
        })
        .catch(err => {
          res.status(500).json({ error: 'An error occurred while fetching the cart' });
        });
    })
    .catch(err => {
      res.status(500).json({ error: 'An error occurred while fetching the user' });
    });
};

