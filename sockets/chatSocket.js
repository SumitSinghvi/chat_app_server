import { Server as socketIo } from 'socket.io';
import { createMessage } from '../models/chat.js';
import { setUserStatus } from '../models/user.js';

const initChatSocket = (server) => {
    const io = new socketIo(server, {
        cors: {
            origin: "http://localhost:5173",
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        console.log(`User ${userId} connected`);

        setUserStatus(userId, 'online', (err) => {
            if (err) {
                console.error(`Failed to set user ${userId} status to online:`, err);
            }
        });

        socket.on('sendMessage', async (data) => {
            const { sender_id, receiver_id, message } = data;
            try {
                const messageId = await createMessage(sender_id, receiver_id, message);
                const roomName = `${Math.min(sender_id, receiver_id)}_${Math.max(sender_id, receiver_id)}`;
                io.to(roomName).emit('receiveMessage', {
                    messageId, 
                    sender_id,
                    receiver_id,
                    message,
                    timestamp: new Date().toISOString(),
                });
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        socket.on('joinRoom', (roomName) => {
            socket.join(roomName);
            console.log(`User joined room: ${roomName}`);
        });

        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected`);
            setUserStatus(userId, 'offline', (err) => {
                if (err) {
                    console.error(`Failed to set user ${userId} status to online:`, err);
                }
            });
        });
    });

    return io;
};

export default initChatSocket;
