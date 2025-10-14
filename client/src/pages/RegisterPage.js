// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/apiService';

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.username || !formData.email || !formData.password) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        try {
            const response = await register(formData);
            setSuccess(response.data.message + " Bạn sẽ được chuyển đến trang đăng nhập.");
            setTimeout(() => {
                navigate('/login'); // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
            }, 2000);
        } catch (err) {
            // Lấy lỗi từ response của server nếu có
            setError(err.response?.data?.message || "Đã có lỗi xảy ra.");
        }
    };

    return (
        <div>
            <h2>Đăng Ký</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tên người dùng:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                    <label>Mật khẩu:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                </div>
                <button type="submit">Đăng Ký</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
}

export default RegisterPage;