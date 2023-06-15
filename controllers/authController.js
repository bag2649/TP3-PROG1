"use strict";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/user');

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log('loadedUser', email, password);

  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error('Utilisateur non trouvé');
        error.statusCode = 404;
        throw error;
      }
      loadedUser = user;
      console.log('loadedUser', loadedUser);
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error('Mauvais mot de passe !');
        error.statusCode = 401;
        throw error;
      }
      // Création du token JWT
      const token = jwt.sign(
        {
          email: loadedUser.email,
          lastName: loadedUser.lastName, 
          firstName: loadedUser.firstName, 
          userId: loadedUser._id.toString(),
        },
        process.env.SECRET_JWT,
        { expiresIn: '5h' }
      );
      res.status(200).json({ token: token });
    })
    .catch((err) => {
      next(err);
    });
};

// Enregistre un utilisateur dans la bd
exports.signup = (req, res, next) => {
  const email = req.body.email;
  const lastName = req.body.lastName;
  const firstName = req.body.firstName;
  const city = req.body.city;
  const password = req.body.password;
  const isAdmin = req.body.isAdmin;
  const cart = req.body.cart;

  // Utilisation de bcrypt pour hacher le mot de passe
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        lastName: lastName,
        firstName: firstName,
        city: city,
        password: hashedPassword,
        isAdmin: isAdmin || false,
        cart: cart
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({message: "Utilisateur créé !", userId: result.id});
    })
    .catch(err => {
      next(err);
    });
};

