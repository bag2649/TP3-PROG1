"use strict";

// Récupère le modèle Article
const Product = require('../models/product');
const User = require('../models/user');

// Utilise la méthode find() afin de récupérer tous les articles
exports.getProducts = (req, res, next) => {
  Product.find()
  .then(products => {
    res.status(200).json({
      product: products,
      pageTitle: 'Accueil'
    });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
  });
};

// Récupère un article grâce à son id
exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: "Produit introuvable" });
      }
      
      res.status(200).json({
        product: product,
        pageTitle: 'Détails du produit'
      });
    })
    .catch(err => {
      if (err.name === "CastError") {
        return res.status(404).json({ message: "Produit introuvable" });
      }
      res.status(500).json({ message: "Une erreur est survenue lors de la récupération du produit" });
    });
};


exports.createProduct = (req, res, next) => {
  const { title, desc, imageUrl, categoryId, price, isSold} = req.body

  const product = new Product({
   
    title: title,
    desc: desc,
    imageUrl: imageUrl,
    userId: req.user.userId,
    categoryId : categoryId,
    price: price,
    isSold: isSold

  });

  product.save()
    .then(result => {
      res.status(201).json({
        message: "Product create with success",
        product: result
      })
    })
    .catch(err => {
      return res.status(422).json({
        errorMessage: err.errors
      })
    })


}

const mongoose = require('mongoose');

exports.updateProduct = (req, res, next) => {
  const { title, desc, imageUrl, categoryId, price, isSold } = req.body;
  const productId = req.params.productId;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(404).json({
      message: 'Produit non trouvé'
    });
  }

  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: 'Produit non trouvé'
        });
      }

      product.title = title;
      product.desc = desc;
      product.imageUrl = imageUrl;
      product.categoryId = categoryId;
      product.price = price;
      product.isSold = isSold;
      return product.save();
    })
    .then(result => {
      res.status(200).json({
        message: 'Produit mis à jour avec succès',
        product: result
      });
    })
    .catch(err => {
      next(err);
    });
};



exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findByIdAndRemove(productId)
    .then(deletedProduct => {
      if (!deletedProduct) {
        return res.status(404).json({
          message: "Product not found"
        });
      }
      res.status(200).json({
        message: "Product deleted successfully"
      });
    })
    .catch(err => {
      next(err);
    });
};

exports.getProductsByUser = (req, res, next) => {
  const userId = req.params.userId;

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: 'Utilisateur non trouvé'
        });
      }

      Product.find({ userId: userId })
        .then(products => {
          res.status(200).json({
            products: products,
            pageTitle: 'Produits vendus par l\'utilisateur'
          });
        })
        .catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(404).json({
          message: 'Utilisateur non trouvé'
        });
      }

      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};