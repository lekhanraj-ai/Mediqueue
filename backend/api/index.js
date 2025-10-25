const express = require("express");
const app = express();
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { router } = require('../routes/route.js');
const connectDB = require('../connect/connect.js');
require('dotenv').config();

const port = process.env.PORT || 5000;

// Create HTTP server and Socket.IO instance
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000", // React app URL
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', router);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join a specific doctor's queue room
    socket.on('joinDoctorQueue', (doctorId) => {
        socket.join(`doctor-${doctorId}`);
    });

    // Join a specific appointment room
    socket.on('joinAppointment', (appointmentId) => {
        socket.join(`appointment-${appointmentId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Attach io instance to app for use in routes
app.set('io', io);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        httpServer.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();