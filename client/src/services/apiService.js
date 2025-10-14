import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

// Hàm xác thực
export const register = (userData) => apiClient.post('/auth/register', userData);
export const login = (credentials) => apiClient.post('/auth/login', credentials);

// Hàm tìm kiếm user
export const searchUsers = (query, token) => {
    return apiClient.get(`/friends/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// HÀM MỚI: Lấy danh sách các cuộc trò chuyện
export const getConversations = (token) => {
    return apiClient.get('/friends/conversations', {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// HÀM MỚI: Lấy lịch sử tin nhắn
export const getMessageHistory = (otherUserId, token) => {
    return apiClient.get(`/friends/messages/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};