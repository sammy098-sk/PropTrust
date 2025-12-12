const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { Message } = require('./models/Schemas');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bizbridge', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/business', require('./routes/businessRoutes'));
app.use('/api/investor', require('./routes/investorRoutes'));

// Admin Routes (Simplified)
app.use('/api/admin', require('./middleware/authMiddleware').adminAuth, (req, res) => {
  res.send("Admin Dashboard API");
});

// Real-time Chat Logic with Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for dev
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('send_message', async (data) => {
    const { senderId, recipientId, content } = data;
    
    // Save to DB
    try {
      const newMessage = new Message({ sender: senderId, recipient: recipientId, content });
      await newMessage.save();

      // Emit to recipient's room
      io.to(recipientId).emit('receive_message', newMessage);
      io.to(senderId).emit('message_sent', newMessage); // Confirm to sender
    } catch (e) {
      console.error("Error saving message", e);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));