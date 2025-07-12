const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const messageRoutes = require('./routes/message');
const http = require('http')
const {Server} = require('socket.io')

dotenv.config();
connectDB();

const app = express();
// Socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
        'http://localhost:5500',//frontend url
        "http://127.0.0.1:5500"
    ], 
    credentials: true
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/messages', messageRoutes);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// mongod --dbpath=D:\afai\data\rentalApp

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

    socket.on('joinRoom', ({ roomId }) => {
        socket.join(roomId);
    });

    socket.on('sendMessage', async (msgData) => {
        try {
          // Extract user ID from token manually if needed
          const Message = require('./models/message');
      
          const newMessage = await Message.create({
            sender_id: msgData.sender_id,     // <-- this must exist!
            receiver_id: msgData.receiver_id,
            property_id: msgData.property_id,
            message_text: msgData.message_text
          });
      
          io.to(msgData.roomId).emit('receiveMessage', newMessage);
        } catch (err) {
          console.error('Socket message send failed:', err.message);
        }
      });

    socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });

});