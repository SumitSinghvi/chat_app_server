// authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail, getUserByUsername, getUserByPhone, authUser } from '../models/user.js';
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
        return res.status(500).json({msg: 'Server error'});
      }
      if (emailExists.length > 0) {
        return res.status(400).json({ errors: [{ msg: 'Email already exists' }] });
      }

      getUserByUsername(name, (err, usernameExists) => {
        if (err) {
          console.error(err);
          return res.status(500).json({msg: 'Server error'});
        }
        if (usernameExists.length > 0) {
          return res.status(400).json({ errors: [{ msg: 'Username already exists' }] });
        }

        getUserByPhone(phone, (err, phoneExists) => {
          if (err) {
            console.error(err);
            return res.status(500).json({msg: 'Server error'});
          }
          if (phoneExists.length > 0) {
            return res.status(400).json({ errors: [{ msg: 'Phone number already exists' }] });
          }

          bcrypt.hash(password, 10, async (err, hashedPassword) => {
            if (err) {
              console.error(err);
              return res.status(500).json({msg: 'Server error'});
            }

            const newUser = { name, email, phone, role, password: hashedPassword };
            createUser(newUser, (err, results) => {
              if (err) {
                console.error(err);
                return res.status(500).json({msg: 'Server error'});
              }
            });
            authUser(email, (err, results) => {
              if (err) return res.status(500).json({msg: 'Server error 1'});
              if (results.length === 0) return res.status(404).json({msg: 'user not found'});
          
              const user = results[0];
          
              bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err){
                  console.log(err);
                  return res.status(500).json({msg: 'Server error 2'});
                } 
                if (!isMatch) return res.status(401).json({msg: 'INvalid credentials'});
          
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '70h' });
                res.status(200).json({ token, user });
              });
            });
          });
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({msg: 'Server error'});
  }
};

const login = async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  authUser(email, (err, results) => {
    if (err) return res.status(500).json({msg: 'Server error 1'});
    if (results.length === 0) return res.status(404).json({msg: 'user not found'});

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err){
        console.log(err);
        return res.status(500).json({msg: 'Server error 2'});
      } 
      if (!isMatch) return res.status(401).json({msg: 'INvalid credentials'});

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '70h' });
      res.status(200).json({ token, user });
    });
  });
};

const logout = (req, res) => {
  res.json('Logged out successfully');
};

export { register, login, logout };
