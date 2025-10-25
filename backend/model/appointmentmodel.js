const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient_name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  contact_number: {
    type: String,
    required: true,
  },
  doc_name: {
    type: String,
    required: true,
  },
  doctor_id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  tokenNumber: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'called', 'served'],
    default: 'pending',
  },
  description: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Index to avoid token collisions for same doctor/date/timeSlot
appointmentSchema.index({ doctor_id: 1, date: 1, timeSlot: 1, tokenNumber: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);