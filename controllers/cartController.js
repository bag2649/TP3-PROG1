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
        return res.status(404).json({ message: "Le panier n'a pas été trouvé." });
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
      res.status(500).json({ error: "Une erreur est survenue lors de la récupération du panier.", error });
    });
};


exports.addToCart = (req, res, next) => {
  const userId = req.user.userId;
  const productId = req.body.productId;

  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ error: 'Produit introuvable' });
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
                            res.status(200).json({ productId: product._id, message: 'Produit ajouté au panier avec succès' });
                          })
                          .catch(err => {
                            res.status(500).json({ error: "Une erreur est survenue lors de la mise à jour de la propriété isSold du produit" });
                          });
                      })
                      .catch(err => {
                        res.status(500).json({ error: "Une erreur est survenue lors de l'ajout du produit au panier" });
                      });
                  });
              })
              .catch(err => {
                res.status(500).json({ error: "Une erreur est survenue lors de l'ajout du produit au panier" });
              });
          }

          // Vérifier si le produit est déjà présent dans le panier
          const existingProduct = cart.products.find(p => p.productId.toString() === productId);

          if (existingProduct) {
            return res.status(409).json({ error: 'Le produit est déjà présent dans le panier' });
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
                      res.status(200).json({ productId: product._id, message: 'Produit ajouté au panier avec succès' });
                    })
                    .catch(err => {
                      res.status(500).json({ error: "Une erreur est survenue lors de la mise à jour de la propriété isSold du produit" });
                    });
                })
                .catch(err => {
                  res.status(500).json({ error: "Une erreur est survenue lors de l'ajout du produit au panier" });
                });
            })
            .catch(err => {
              res.status(500).json({ error: "Une erreur est survenue lors de l'ajout du produit au panier" });
            });
        })
        .catch(err => {
          res.status(404).json({ error: 'Le panier n\'a pas été trouvé' });
        });
    })
    .catch(err => {
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du produit' });
    });
};



exports.removeFromCart = (req, res, next) => {
  const userId = req.user.userId;
  const productId = req.params.id;

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      Cart.findOne({ userId })
        .then(cart => {
          if (!cart) {
            return res.status(404).json({ error: 'Panier non trouvé' });
          }

          const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

          if (productIndex === -1) {
            return res.status(404).json({ error: 'Produit non trouvé dans le panier' });
          }

          const removedProduct = cart.products[productIndex];
          cart.products.splice(productIndex, 1);

          cart.save()
            .then(savedCart => {
              // Mettre à jour la propriété 'cart' de l'utilisateur dans la base de données
              user.cart = savedCart.products.map(item => item.productId);
              user.save()
                .then(() => {
                  res.status(200).json({ productId: removedProduct.productId, message: 'Produit supprimé du panier avec succès' });
                })
                .catch(err => {
                  res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du panier de l\'utilisateur' });
                });
            })
            .catch(err => {
              res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du produit du panier' });
            });
        })
        .catch(err => {
          res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du panier' });
        });
    })
    .catch(err => {
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de l\'utilisateur' });
    });
};

