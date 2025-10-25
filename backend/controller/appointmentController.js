const Doctor = require('../model/doctor');
const Appointment = require('../model/appointmentmodel');

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

// Create a new appointment with token assignment
async function bookAppointment(req, res) {
  try {
    const { patient_name, age, contact_number, doc_name, doctor_id, date, timeSlot, description } = req.body;

    if (!patient_name || !age || !contact_number || !doc_name || !doctor_id || !timeSlot || !description) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // normalize date to midnight
    const apptDate = date ? new Date(date) : new Date();
    apptDate.setHours(0,0,0,0);

    // count existing non-served appointments for this doctor/date/timeSlot
    const existingCount = await Appointment.countDocuments({
      doctor_id,
      date: apptDate,
      timeSlot,
      status: { $in: ['pending','called'] }
    });

    if (existingCount >= 10) {
      return res.status(400).json({ success: false, message: 'This time slot is full for the selected doctor (max 10).' });
    }

    const tokenNumber = existingCount + 1;
    const status = tokenNumber === 1 ? 'called' : 'pending';

    const appointment = await Appointment.create({
      patient_name,
      age: Number(age),
      contact_number,
      doc_name,
      doctor_id,
      date: apptDate,
      timeSlot,
      description,
      tokenNumber,
      status
    });

    res.status(201).json({ success: true, message: 'Appointment booked successfully', appointment });
  } catch (error) {
    console.error('Appointment Booking Error:', error);
    // handle duplicate token collisions by advising retry
    if (error.code === 11000) {
      return res.status(500).json({ success: false, message: 'Token assignment conflict, please try booking again.' });
    }
    res.status(500).json({ success: false, message: 'Server error during appointment booking', error: error.message });
  }
}

// Get queue for a doctor for a particular date and timeslot
async function getQueue(req, res) {
  try {
    const { doctor_id } = req.params;
    const { date, timeSlot } = req.query;
    if (!doctor_id || !timeSlot) return res.status(400).json({ success:false, message: 'doctor_id and timeSlot required' });
    const apptDate = date ? new Date(date) : new Date();
    apptDate.setHours(0,0,0,0);

    const queue = await Appointment.find({ doctor_id, date: apptDate, timeSlot }).sort({ tokenNumber: 1 });
    res.json({ success: true, queue });
  } catch (err) {
    console.error('Error fetching queue:', err);
    res.status(500).json({ success:false, message: 'Server error', error: err.message });
  }
}

// Advance an appointment (mark served and call next)
async function advanceAppointment(req, res) {
  try {
    const { id } = req.params;
    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ success:false, message: 'Appointment not found' });

    appt.status = 'served';
    await appt.save();

    // find next pending
    const next = await Appointment.findOne({
      doctor_id: appt.doctor_id,
      date: appt.date,
      timeSlot: appt.timeSlot,
      status: 'pending'
    }).sort({ tokenNumber: 1 });

    if (next) {
      next.status = 'called';
      await next.save();
    }

    res.json({ success:true, served: appt, next });
  } catch (err) {
    console.error('Error advancing appointment:', err);
    res.status(500).json({ success:false, message: 'Server error', error: err.message });
  }
}

// Get appointment by id
async function getAppointmentById(req, res) {
  try {
    const { id } = req.params;
    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ success:false, message: 'Appointment not found' });
    res.json({ success:true, appointment: appt });
  } catch (err) {
    console.error('Error fetching appointment:', err);
    res.status(500).json({ success:false, message: 'Server error', error: err.message });
  }
}

module.exports = {
  getAllDoctors,
  bookAppointment,
  getQueue,
  advanceAppointment,
  getAppointmentById
};