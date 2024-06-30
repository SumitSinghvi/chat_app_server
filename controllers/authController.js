// authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail, getUserByUsername, getUserByPhone } from '../models/user.js';
import { validationResult } from 'express-validator';

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, role, password } = req.body;

  try {
    getUserByEmail(email, (err, emailExists) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Server error');
      }
      if (emailExists.length > 0) {
        return res.status(400).json({ errors: [{ msg: 'Email already exists' }] });
      }

      getUserByUsername(name, (err, usernameExists) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Server error');
        }
        if (usernameExists.length > 0) {
          return res.status(400).json({ errors: [{ msg: 'Username already exists' }] });
        }

        getUserByPhone(phone, (err, phoneExists) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Server error');
          }
          if (phoneExists.length > 0) {
            return res.status(400).json({ errors: [{ msg: 'Phone number already exists' }] });
          }

          bcrypt.hash(password, 10, async (err, hashedPassword) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Server error');
            }

            const newUser = { name, email, phone, role, password: hashedPassword };
            createUser(newUser, (err, results) => {
              if (err) {
                console.error(err);
                return res.status(500).send('Error creating user');
              }
            });

            res.status(201).send('User registered successfully');
          });
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const login = async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  getUserByEmail(email, (err, results) => {
    if (err) return res.status(500).send('Server error');
    if (results.length === 0) return res.status(404).send('User not found');

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).send('Server error');
      if (!isMatch) return res.status(401).send('Invalid credentials');

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '70h' });
      res.json({ token, user });
    });
  });
};

const logout = (req, res) => {
  res.json('Logged out successfully');
};

export { register, login, logout };
