import db from '../config.js';

export const createMessage = async (senderId, receiverId, message) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
            [senderId, receiverId, message],
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.insertId);
                }
            }
        );
    });
};

export const getMessagesBetweenUsers = async (user1Id, user2Id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY timestamp',
            [user1Id, user2Id, user2Id, user1Id],
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            }
        );
    });
};

export const markMessagesAsRead = async (user1Id, user2Id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE messages SET read_status = TRUE WHERE sender_id = ? AND receiver_id = ?',
            [user1Id, user2Id],
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.affectedRows);
                }
            }
        );
    });
};
