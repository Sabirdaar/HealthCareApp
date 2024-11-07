// server.js
const express = require('express');
const admin = require('firebase-admin');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// Initialize Express App
const app = express();
app.use(bodyParser.json());

// Rate Limiting for Security
const createAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 create account requests per `window`
  message: 'Too many accounts created from this IP, please try again later',
});

// User Registration Endpoint
app.post(
  '/create-account',
  createAccountLimiter,
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('fullName').not().isEmpty().withMessage('Full name is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, fullName } = req.body;
    try {
      // Firebase Auth Create User
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: fullName,
      });

      // Customize the response and add other initializations if needed
      res.status(201).json({ message: 'User created successfully', user: userRecord });
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        return res.status(400).json({ error: 'Email already in use' });
      }
      res.status(500).json({ error: 'Failed to create account' });
    }
  }
);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
