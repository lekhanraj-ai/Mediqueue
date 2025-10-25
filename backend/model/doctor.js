const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  doctor_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  specialization: { type: String, required: true },
  experience_years: { type: Number, required: true },
  contact_number: { type: String, required: true }
});

module.exports = mongoose.model('Doctor', doctorSchema);