import { getUserById, updateUser, deleteUser, getUserByRole } from '../models/user.js';
import { validationResult } from 'express-validator';

const readUser = async(req, res) => {
  const userId = req.body.id;
  getUserById(userId, (err, results) => {
    if (err) return res.status(500).json({msg: 'Server error'});
    if (results.length === 0) return res.status(404).json({msg: 'user not found'});

    res.json(results[0]);
  });
};
const getUserByRoles = async(req, res) => {
  const userRole = req.body.role;
  getUserByRole(userRole, (err, results) => {
    if (err) return res.status(500).json({msg: 'Server error'});
    if (results.length === 0) return res.status(404).json({msg: 'user not found error'});

    res.json(results);
  });
};

const updateUserDetails = async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.user.id;
  const { name, email, phone, role } = req.body;
  const updatedUser = { name, email, phone, role };

  updateUser(userId, updatedUser, (err, results) => {
    if (err) 
      {
        return res.status(500).send(err);
      }
      res.send(results)
  });
};

const deleteUserAccount = async(req, res) => {
  const userId = req.user.id;

  deleteUser(userId, (err, results) => {
    if (err) return res.status(500).json({msg: 'Server error'});
    res.json(results ? "user deleted" : "not deleted");
  });
};

export { readUser, updateUserDetails, deleteUserAccount, getUserByRoles };
