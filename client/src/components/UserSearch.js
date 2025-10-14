import React, { useState } from 'react';
import { searchUsers } from '../services/apiService';
import './UserSearch.css';

// Component nhận một prop là onSelectUser từ cha
function UserSearch({ onSelectUser }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);

        if (searchQuery.length > 1) {
            const token = localStorage.getItem('token');
            const response = await searchUsers(searchQuery, token);
            setResults(response.data);
        } else {
            setResults([]);
        }
    };

    const handleUserClick = (user) => {
        onSelectUser(user); // Gọi hàm của cha để xử lý
        setQuery(''); // Xóa ô tìm kiếm
        setResults([]); // Ẩn kết quả
    };

    return (
        <div className="user-search-container">
            <input
                type="text"
                className="search-input"
                placeholder="Tìm và bắt đầu chat..."
                value={query}
                onChange={handleSearch}
            />
            {results.length > 0 && (
                <div className="search-results">
                    {results.map(user => (
                        <div key={user.id} className="result-item" onClick={() => handleUserClick(user)}>
                            <span>{user.username}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserSearch;