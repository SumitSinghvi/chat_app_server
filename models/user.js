import db from "../config.js";

const createUser = (user, callback) => {
  const query =
    "INSERT INTO users (name, email, phone_number, role, password) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [user.name, user.email, user.phone, user.role, user.password],
    callback
  );
};

const getUserByEmail = (email, callback) => {
  const query = "SELECT id, name, email, phone_number, role FROM users WHERE email = ?";
  db.query(query, [email], callback);
};

const authUser = (email, callback) => {
  const query = "SELECT id, name, email, phone_number, password, role FROM users WHERE email = ?";
  db.query(query, [email], callback);
};

const getUserByUsername = (name, callback) => {
  const query = "SELECT * FROM users WHERE name = ?";
  db.query(query, [name], callback);
};

const getUserByPhone = (phone, callback) => {
  const query = "SELECT * FROM users WHERE phone_number = ?";
  db.query(query, [phone], callback);
};

const getUserById = (id, callback) => {
  const query =
    "SELECT name, email, phone_number, role FROM users WHERE id = ?";
  db.query(query, [id], callback);
};

const updateUser = (id, user, callback) => {
  const { name, email, phone, role } = user;
  try {
    getUserByEmail(email, (err, emailExists) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
      if (emailExists.length > 0) {
        return callback({ message: 'email already exists' });
      }

      getUserByUsername(name, (err, usernameExists) => {
        if (err) {
          console.error(err);
          return callback(err);
        }
        if (usernameExists.length > 0) {
          return callback({ message: 'Username already exists' });
        }

        getUserByPhone(phone, (err, phoneExists) => {
          if (err) {
            console.error(err);
            return callback(err);
          }
          if (phoneExists.length > 0) {
            return callback({ message: 'phone number already exists' });
          }
          const { name, email, phone, role } = user;
          const query =
            "UPDATE users SET name = ?, email = ?, phone_number = ?, role = ? WHERE id = ?";
          db.query(query, [name, email, phone, role, id], callback);
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({msg: 'Server error'});
  }
};

const deleteUser = (id, callback) => {
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return callback(err, null);
    }
    if (result.affectedRows === 0) {
      return callback(new Error("User not found"), null);
    }
    callback(null, true);
  });
};

const getUserByRole = (role, callback) => {
  const query =
    "SELECT id, name, email, phone_number, role FROM users WHERE role = ?";
  db.query(query, [role], callback);
};

const setUserStatus = (userId, status, callback) => {
  const sql = `UPDATE users SET status = ? WHERE id = ?`;
  db.query(sql, [status, userId], (err, results) => {
      if (err) {
          console.error('Error setting user status:', err);
          return callback(err);
      }
      console.log(`User ${userId} status set to ${status}`);
      callback(null, results);
  });
};

export {
  setUserStatus,
  createUser,
  getUserByEmail,
  getUserByUsername,
  getUserByPhone,
  getUserById,
  updateUser,
  deleteUser,
  getUserByRole,
  authUser,
};
