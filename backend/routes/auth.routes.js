const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth.controller');

router.post(
  '/register',
  [
    body('fullName').notEmpty().withMessage('Full name is required'),

    body('email').isEmail().withMessage('Invalid email'),

    body('phone').notEmpty().withMessage('Phone number is required'),

    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),

    body('confirmPassword')
      .notEmpty().withMessage('Confirm password is required')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      })
  ],
  authController.register
);

router.post('/login', authController.login);

module.exports = router;
