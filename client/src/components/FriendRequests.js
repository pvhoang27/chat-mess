import React, { useState, useEffect } from 'react';
import { getPendingRequests, acceptFriendRequest } from '../services/apiService';
import './FriendRequests.css';

function FriendRequests({ socket, onAcceptFriend }) {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await getPendingRequests(token);
                setRequests(response.data);
            } catch (error) {
                console.error("Lỗi khi tải lời mời:", error);
            }
        };
        fetchRequests();

        const handleNewRequest = (newRequestData) => {
            setRequests(prev => [newRequestData, ...prev]);
        };
        socket.on('newFriendRequest', handleNewRequest);

        return () => socket.off('newFriendRequest', handleNewRequest);
    }, [socket]);

    const handleAccept = async (friendshipId) => {
        try {
            const token = localStorage.getItem('token');
            await acceptFriendRequest(friendshipId, token);
            setRequests(prev => prev.filter(req => req.id !== friendshipId));
            onAcceptFriend(); // Gọi hàm để tải lại danh sách bạn bè
        } catch (error) {
            console.error("Lỗi khi chấp nhận lời mời:", error);
        }
    };

    if (requests.length === 0) {
        return null; // Ẩn component nếu không có lời mời
    }

    return (
        <div className="friend-requests-container">
            <h4>Lời mời kết bạn</h4>
            {requests.map(req => (
                <div key={req.id} className="request-item">
                    <span>{req.requester.username}</span>
                    <button onClick={() => handleAccept(req.id)}>Đồng ý</button>
                </div>
            ))}
        </div>
    );
}

export default FriendRequests;
