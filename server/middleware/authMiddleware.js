const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Thêm console.log để kiểm tra
    console.log("--- Đang chạy authMiddleware ---");
    
    try {
        // Kiểm tra xem header 'authorization' có tồn tại không
        if (!req.headers.authorization) {
            console.log("Lỗi Middleware: Không tìm thấy header Authorization.");
            return res.status(401).json({ message: "Xác thực thất bại! Thiếu token." });
        }
        
        // Tách token ra khỏi chuỗi "Bearer TOKEN"
        const token = req.headers.authorization.split(" ")[1];
        
        // Giải mã token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret_key');
        
        // Gắn thông tin user đã giải mã vào request
        req.user = { id: decodedToken.id, username: decodedToken.username };
        
        console.log("Middleware xác thực thành công cho user:", req.user);
        
        // Cho phép request đi tiếp đến controller
        next();
        
    } catch (error) {
        // Nếu token không hợp lệ (sai, hết hạn,...)
        console.error("!!! LỖI TRONG authMiddleware:", error.message);
        res.status(401).json({ message: "Xác thực thất bại! Token không hợp lệ." });
    }
};