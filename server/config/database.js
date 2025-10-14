const { Sequelize } = require('sequelize');

// --- THAY THẾ THÔNG TIN CỦA BẠN VÀO ĐÂY ---
const database = 'chat'; // Tên database bạn tạo trong MySQL Workbench
const user = 'root';              // User đăng nhập MySQL, thường là 'root'
const password = '***REMOVED***';      // Mật khẩu của user đó

const sequelize = new Sequelize(database, user, password, {
    host: 'localhost',
    dialect: 'mysql' // Khai báo chúng ta đang dùng MySQL
});

module.exports = sequelize;