const mongoose = require('mongoose'); 
const appointmentSchema = new mongoose.Schema({
  patient_name: { 
    type: String, 
    required: true, 
  },
  age: { 
    type: String,
     required: true
  },
    contact_number: { 
    type: String,
     required: true  
  },
  doc_name: { 
    type: String,
     required: true
  },
  timeSlot:{
    type: String,
    required: true
  }
  ,
  description: { 
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('appointmentModel', appointmentSchema);