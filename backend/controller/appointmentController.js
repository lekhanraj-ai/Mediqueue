const Doctor = require('../model/doctor');
const appointmentModel=require('../model/appointmentmodel')

// Get all doctors
async function getAllDoctors(req, res) {
  try {
    const doctors = await Doctor.find({}, {
      doctor_id: 1,
      name: 1,
      specialization: 1,
      experience_years: 1
    });
    res.status(200).json(doctors);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Create a new appointment
async function bookAppointment(req, res) {
  try {
    const { patient_name, age, contact_number, doc_name,timeSlot,description } = req.body;
    
    // Validation
    if (!patient_name || !age || !contact_number || !doc_name ||!timeSlot|| !description) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    const appointment = await appointmentModel.create({
      patient_name,
      age,
      contact_number,
      doc_name,
      timeSlot,
      description
    });
    
    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment: {  
        _id: appointment._id,
        patient_name: appointment.patient_name,
        age: appointment.age,
        contact_number: appointment.contact_number,
        doc_name: appointment.doc_name,
        timeSlot: appointment.timeSlot,
        description: appointment.description,
        createdAt: appointment.createdAt
      }
    });
    
  } catch (error) {
    console.error('Appointment Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during appointment booking',
      error: error.message
    });
  }
}

module.exports = {
  getAllDoctors,
  bookAppointment
};