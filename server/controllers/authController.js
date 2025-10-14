const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize'); // Import Operator

/**
 * Xử lý đăng ký tài khoản người dùng mới.
 */
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Kiểm tra các trường thông tin bắt buộc
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin." });
        }

        // 2. Kiểm tra xem email hoặc username đã tồn tại chưa
        const existingUser = await User.findOne({ 
            where: { 
                [Op.or]: [{ email: email }, { username: username }]
            } 
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ message: "Tên người dùng này đã tồn tại." });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ message: "Email này đã được sử dụng." });
            }
        }

        // 3. Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Tạo người dùng mới trong cơ sở dữ liệu
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // 5. Trả về thông báo thành công
        res.status(201).json({ message: "Đăng ký thành công!", userId: user.id });

    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra trên server", error: error.message });
    }
};

/**
 * Xử lý đăng nhập bằng TÊN NGƯỜI DÙNG và mật khẩu.
 */
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Vui lòng nhập tên người dùng và mật khẩu." });
        }

        // Tìm người dùng trong CSDL bằng username
        const user = await User.findOne({ where: { username: username } });
        if (!user) {
            return res.status(401).json({ message: "Tên người dùng hoặc mật khẩu không đúng." });
        }

        // So sánh mật khẩu đã nhập với mật khẩu đã mã hóa trong CSDL
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Tên người dùng hoặc mật khẩu không đúng." });
        }

        // Nếu thông tin chính xác, tạo JSON Web Token (JWT)
        const payload = {
            id: user.id,
            username: user.username,
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your_default_secret_key',
            { expiresIn: '1h' }
        );

        // Trả về token và thông tin cơ bản của người dùng
        res.status(200).json({
            message: "Đăng nhập thành công!",
            token: token,
            user: { id: user.id, username: user.username }
        });

    } catch (error) {
        // Gửi về một thông báo lỗi chung
        res.status(500).json({ message: "Đã có lỗi xảy ra trên server", error: error.message });
    }
};

