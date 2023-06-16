"use strict";

const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const categoryController = require('../controllers/categoryController');
const userController = require('../controllers/userController');
const cartController = require('../controllers/cartController');
const searchController = require('../controllers/searchController');

// isAuth est un middleware qui vérifie si l'utilisateur est authentifié
const isAuth = require('../middleware/is-auth');
//isAdmin est un middleware qui vérifie si l'utilisateur est administrateur
const isAdmin = require('middleware/is-admin')


//Route products
router.get('/products', productsController.getProducts);
router.get('/products/:productId', productsController.getProduct);
router.post('/products', isAuth, productsController.createProduct);
router.delete('/products/:productId', isAuth, productsController.deleteProduct);
router.get('/products/user/:userId',productsController.getProductsByUser);

//Route categories
router.get('/categories', categoryController.getCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post('/categories',isAuth, isAdmin, categoryController.createCategory);
router.put('/categories/:id',isAuth, isAdmin, categoryController.updateCategory);
router.delete('/categories/:id',isAuth, isAdmin, categoryController.deleteCategory);

//Route users
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.get('/users/profile',isAuth, userController.getUserProfile);
router.put('/users/:id',isAuth, userController.updateUser);
router.delete('/users/:id',isAuth, userController.deleteUser);

//Route cart
router.get('/cart', isAuth, cartController.getCart);
router.put('/cart', isAuth, cartController.addToCart);
router.delete('/cart/:id', isAuth, cartController.removeFromCart);

//Route search
router.get('/search', searchController.searchProducts);

// Export des routes pour utilisation dans app.js
module.exports = router;

