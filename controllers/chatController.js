import { createMessage, getMessagesBetweenUsers, markMessagesAsRead } from '../models/chat.js';

export const sendMessage = async (req, res) => {
    const { senderId, receiverId, message } = req.body;
    
    try {
        const messageId = await createMessage(senderId, receiverId, message);
        

        res.status(201).json({ messageId, senderId, receiverId, message });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

export const getMessages = async (req, res) => {
    const { user1Id, user2Id } = req.params;
    
    try {
        const messages = await getMessagesBetweenUsers(user1Id, user2Id);
        
        
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

export const markAsRead = async (req, res) => {
    const { user1Id, user2Id } = req.params;
    
    try {
        const affectedRows = await markMessagesAsRead(user1Id, user2Id);
        
        res.status(200).json({ affectedRows });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ error: 'Failed to mark messages as read' });
    }
};
