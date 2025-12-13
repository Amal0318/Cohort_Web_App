import api from './api';

const messageService = {
    // Get all messages for a mentor
    getMessages: async () => {
        try {
            const response = await api.get('/api/messages/');
            return response.data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    },

    // Send a message to a student
    sendMessage: async (studentId, message) => {
        try {
            const response = await api.post('/api/messages/send/', {
                student_id: studentId,
                message: message,
            });
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    // Mark message as read
    markAsRead: async (messageId) => {
        try {
            const response = await api.patch(`/api/messages/${messageId}/read/`);
            return response.data;
        } catch (error) {
            console.error('Error marking message as read:', error);
            throw error;
        }
    },

    // Get unread message count
    getUnreadCount: async () => {
        try {
            const response = await api.get('/api/messages/unread-count/');
            return response.data.count;
        } catch (error) {
            console.error('Error fetching unread count:', error);
            throw error;
        }
    },
};

export default messageService;
