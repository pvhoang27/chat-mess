// src/App.js (Full Code Mới)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';

// 1. Tạo một Layout chung cho các trang Đăng nhập và Đăng ký
const AuthLayout = () => (
    <div>
        <nav style={{ padding: '20px', textAlign: 'center' }}>
            <Link to="/login">Đăng nhập</Link> | <Link to="/register">Đăng ký</Link>
        </nav>
        <hr />
        {/* Outlet sẽ là nơi render component con (LoginPage hoặc RegisterPage) */}
        <Outlet />
    </div>
);

function App() {
    return (
        <Router>
            <Routes>
                {/* 2. Sử dụng AuthLayout cho các route đăng nhập/đăng ký */}
                <Route element={<AuthLayout />}>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<LoginPage />} />
                </Route>

                {/* Route cho trang Chat sẽ không dùng AuthLayout và không có thanh nav */}
                <Route path="/chat" element={<ChatPage />} />
            </Routes>
        </Router>
    );
}

export default App;