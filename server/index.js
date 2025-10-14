// Các module cần thiết
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

// Các file tự định nghĩa
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const friendRoutes = require('./routes/friendRoutes');

// --- IMPORT MODELS ---
const User = require('./models/user');
const Message = require('./models/message');
const Friendship = require('./models/friendship');

// --- ĐỊNH NGHĨA QUAN HỆ GIỮA CÁC MODEL TẠI ĐÂY ---
User.hasMany(Friendship, { as: 'sentRequests', foreignKey: 'requesterId' });
User.hasMany(Friendship, { as: 'receivedRequests', foreignKey: 'addresseeId' });
Friendship.belongsTo(User, { as: 'requester', foreignKey: 'requesterId' });
Friendship.belongsTo(User, { as: 'addressee', foreignKey: 'addresseeId' });

// --- KHỞI TẠO SERVER ---
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});

const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    req.io = io;
    next();
});

// --- ROUTES API ---
app.use('/api/auth', authRoutes);
app.use('/api/friends', friendRoutes); // Dùng file routes này

// DÒNG CODE GÂY LỖI ĐÃ BỊ XÓA

// --- XỬ LÝ SOCKET.IO ---
io.on('connection', (socket) => {
    console.log('Một người dùng đã kết nối:', socket.id);
    socket.on('joinRoom', (userId) => socket.join(String(userId)));

    socket.on('sendMessage', async (data) => {
        try {
            const message = await Message.create(data);
            io.to(String(data.receiverId)).to(String(data.senderId)).emit('receiveMessage', message);
        } catch (error) {
            console.error("Lỗi khi lưu tin nhắn:", error);
        }
    });

    socket.on('disconnect', () => console.log('Người dùng đã ngắt kết nối:', socket.id));
});

// --- KHỞI ĐỘNG SERVER ---
sequelize.sync()
    .then(() => {
        server.listen(PORT, () => console.log(`Server đang chạy tại http://localhost:${PORT}`));
    })
    .catch(err => console.error('Không thể kết nối tới CSDL:', err));