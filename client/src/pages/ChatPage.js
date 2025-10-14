import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './ChatPage.css';
import UserSearch from '../components/UserSearch';
import { getConversations, getMessageHistory } from '../services/apiService';

const socket = io('http://localhost:5000');

function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const [conversations, setConversations] = useState([]); // State mới: danh sách cuộc trò chuyện
    const [activeChat, setActiveChat] = useState(null);

    // Tải danh sách các cuộc trò chuyện đã có khi vào trang
    const loadConversations = useCallback(async () => {
        if (currentUser) {
            const token = localStorage.getItem('token');
            const response = await getConversations(token);
            setConversations(response.data);
            if (response.data.length > 0 && !activeChat) {
                setActiveChat(response.data[0]);
            }
        }
    }, [currentUser, activeChat]);

    useEffect(() => {
        loadConversations();
    }, [currentUser]); // Chỉ chạy 1 lần khi có user

    // Tải lịch sử tin nhắn mỗi khi activeChat thay đổi
    useEffect(() => {
        const fetchHistory = async () => {
            if (activeChat) {
                const token = localStorage.getItem('token');
                const response = await getMessageHistory(activeChat.id, token);
                setMessages(response.data);
            } else {
                setMessages([]);
            }
        };
        fetchHistory();
    }, [activeChat]);

    // Cuộn xuống tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    // Lắng nghe socket
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        socket.emit('joinRoom', currentUser.id);

        const handleReceiveMessage = (message) => {
            if (activeChat && (message.senderId === activeChat.id || message.senderId === currentUser.id)) {
                setMessages((prev) => [...prev, message]);
            }
        };
        socket.on('receiveMessage', handleReceiveMessage);

        return () => socket.off('receiveMessage', handleReceiveMessage);
    }, [currentUser, navigate, activeChat]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !activeChat) return;
        
        const messageData = {
            senderId: currentUser.id,
            receiverId: activeChat.id,
            content: newMessage,
        };
        socket.emit('sendMessage', messageData);
        setNewMessage('');
    };

    // Hàm để bắt đầu cuộc trò chuyện mới từ kết quả tìm kiếm
    const handleStartConversation = (user) => {
        // Kiểm tra xem cuộc trò chuyện đã có trong danh sách chưa
        const existing = conversations.find(c => c.id === user.id);
        if (!existing) {
            setConversations([user, ...conversations]);
        }
        // Chuyển sang chat với người đó
        setActiveChat(user);
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!currentUser) return null;

    return (
        <div className="chat-page-container">
            <div className="sidebar">
                <div className="sidebar-header">
                    <h3>{currentUser.username}</h3>
                    <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
                </div>
                
                <UserSearch onSelectUser={handleStartConversation} />

                <div className="friend-list">
                    <h4>Các cuộc trò chuyện</h4>
                    {conversations.map((conv) => (
                        <div 
                            key={conv.id} 
                            className={`friend-item ${activeChat?.id === conv.id ? 'active' : ''}`}
                            onClick={() => setActiveChat(conv)}
                        >
                            {conv.username}
                        </div>
                    ))}
                </div>
            </div>
            <div className="chat-area">
                {activeChat ? (
                    <>
                        <div className="chat-header">
                            <h2>Đang chat với {activeChat.username}</h2>
                        </div>
                        <div className="message-list">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id} // Dùng ID tin nhắn từ CSDL
                                    className={`message-bubble ${msg.senderId === currentUser.id ? 'sent' : 'received'}`}
                                >
                                    <p>{msg.content}</p>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form className="message-form" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Nhập tin nhắn..."
                            />
                            <button type="submit">Gửi</button>
                        </form>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <p>Tìm kiếm để bắt đầu cuộc trò chuyện mới</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatPage;