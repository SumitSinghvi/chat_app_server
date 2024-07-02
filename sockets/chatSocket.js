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
            const { senderId, receiverId, message } = data; 
            try {
                const messageId = await createMessage(senderId, receiverId, message);
                const roomName = `${Math.min(senderId, receiverId)}_${Math.max(senderId, receiverId)}`;
                io.to(roomName).emit('receiveMessage', {
                    messageId, 
                    senderId,
                    receiverId,
                    message,
                    timestamp: new Date().toISOString(),
                });
            } catch (error) {
                console.error('Error sending message:', error);
            }
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
