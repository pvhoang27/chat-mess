import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/apiService';

function LoginPage() {
    // State để lưu trữ tên người dùng và mật khẩu
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Cập nhật state khi người dùng nhập liệu
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Xử lý khi người dùng nhấn nút Đăng nhập
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Kiểm tra xem người dùng đã nhập đủ thông tin chưa
        if (!formData.username || !formData.password) {
            setError("Vui lòng nhập tên người dùng và mật khẩu.");
            return;
        }

        try {
            // Gọi hàm login từ apiService
            const response = await login(formData);
            
            // Lưu token và thông tin người dùng vào localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Chuyển hướng đến trang chat
            navigate('/chat'); 
        } catch (err) {
            // Hiển thị lỗi từ server hoặc một lỗi chung
            setError(err.response?.data?.message || "Lỗi server, vui lòng thử lại sau.");
        }
    };

    return (
        <div style={{ width: '300px', margin: '50px auto', textAlign: 'center' }}>
            <h2>Đăng Nhập</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                    <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Tên người dùng:</label>
                    <input 
                        id="username"
                        type="text" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Mật khẩu:</label>
                    <input 
                        id="password"
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>Đăng Nhập</button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
        </div>
    );
}

export default LoginPage;
