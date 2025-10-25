const express = require('express')
const router = express.Router()

const { loginUser, registerUser } = require('../controller/controller.js');
const { doctorLogin } = require('../controller/doctorController.js');
const { managementLogin } = require('../controller/managementController.js');
const { getAllDoctors, bookAppointment } = require('../controller/appointmentController.js');

// User routes
router.post('/user/register', registerUser);
router.post('/user/login', loginUser);

// Doctor routes
router.post('/doctor/login', doctorLogin);
router.get('/doctors', getAllDoctors);

// Management routes
router.post('/management/login', managementLogin);

// Appointment routes
// Keep both endpoints for compatibility: frontend may call either
router.post('/appointment/book', bookAppointment);
router.post('/appointments', bookAppointment);

module.exports = { router }