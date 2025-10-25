const Doctor = require('../model/doctor');

async function doctorLogin(req, res) {
  try {
    const { doctor_id, password } = req.body;
    if (!doctor_id || !password) {
      return res.status(400).json({ message: 'Doctor ID and password are required' });
    }
    const doctor = await Doctor.findOne({ doctor_id });
    if (!doctor) {
      console.log('Doctor not found:', doctor_id);
      return res.status(400).json({ message: 'Invalid doctor ID or password' });
    }
    if (doctor.password.trim() !== password.trim()) {
      console.log('Password mismatch for doctor:', doctor_id);
      return res.status(400).json({ message: 'Invalid doctor ID or password' });
    }
    res.status(200).json({
      message: `Welcome, ${doctor.name}!`,
      doctor: {
        doctor_id: doctor.doctor_id,
        name: doctor.name,
        specialization: doctor.specialization,
        experience_years: doctor.experience_years,
        contact_number: doctor.contact_number
      }
    });
  } catch (err) {
    console.error('Doctor login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = { doctorLogin };
