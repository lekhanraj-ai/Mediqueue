const mongoose = require('mongoose');
const Doctor = require('../model/doctor');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const doctors = [
    {"doctor_id":"D001","name":"Dr. Ananya Rao","username":"ananya_rao","password":"ananya123","specialization":"Cardiologist","experience_years":12,"contact_number":"9876543210"},
    {"doctor_id":"D002","name":"Dr. Rohan Shetty","username":"rohan_shetty","password":"rohan123","specialization":"Orthopedic Surgeon","experience_years":9,"contact_number":"9845123678"},
    {"doctor_id":"D003","name":"Dr. Sneha Patil","username":"sneha_patil","password":"sneha123","specialization":"Pediatrician","experience_years":7,"contact_number":"9912345678"},
    {"doctor_id":"D004","name":"Dr. Karthik Menon","username":"karthik_menon","password":"karthik123","specialization":"Neurologist","experience_years":15,"contact_number":"9898765432"},
    {"doctor_id":"D005","name":"Dr. Priya Sharma","username":"priya_sharma","password":"priya123","specialization":"Dermatologist","experience_years":8,"contact_number":"9723456789"},
    {"doctor_id":"D006","name":"Dr. Aditya Verma","username":"aditya_verma","password":"aditya123","specialization":"General Physician","experience_years":10,"contact_number":"9988776655"},
    {"doctor_id":"D007","name":"Dr. Lakshmi Iyer","username":"lakshmi_iyer","password":"lakshmi123","specialization":"Gynecologist","experience_years":13,"contact_number":"9876054321"},
    {"doctor_id":"D008","name":"Dr. Rajesh Gupta","username":"rajesh_gupta","password":"rajesh123","specialization":"ENT Specialist","experience_years":11,"contact_number":"9898123456"},
    {"doctor_id":"D009","name":"Dr. Neha Reddy","username":"neha_reddy","password":"neha123","specialization":"Dentist","experience_years":6,"contact_number":"9811122233"},
    {"doctor_id":"D010","name":"Dr. Vikram Nair","username":"vikram_nair","password":"vikram123","specialization":"Ophthalmologist","experience_years":9,"contact_number":"9789012345"},
    {"doctor_id":"D011","name":"Dr. Arjun Pillai","username":"arjun_pillai","password":"arjun123","specialization":"Psychiatrist","experience_years":10,"contact_number":"9823456790"},
    {"doctor_id":"D012","name":"Dr. Meera Joshi","username":"meera_joshi","password":"meera123","specialization":"Endocrinologist","experience_years":14,"contact_number":"9845012340"},
    {"doctor_id":"D013","name":"Dr. Nitin Deshmukh","username":"nitin_deshmukh","password":"nitin123","specialization":"Oncologist","experience_years":16,"contact_number":"9898989898"},
    {"doctor_id":"D014","name":"Dr. Ritu Agarwal","username":"ritu_agarwal","password":"ritu123","specialization":"Radiologist","experience_years":9,"contact_number":"9812345670"},
    {"doctor_id":"D015","name":"Dr. Suresh Kumar","username":"suresh_kumar","password":"suresh123","specialization":"Pulmonologist","experience_years":11,"contact_number":"9833445566"},
    {"doctor_id":"D016","name":"Dr. Kavya Nambiar","username":"kavya_nambiar","password":"kavya123","specialization":"Physiotherapist","experience_years":6,"contact_number":"9877001234"},
    {"doctor_id":"D017","name":"Dr. Harish Bhat","username":"harish_bhat","password":"harish123","specialization":"Urologist","experience_years":13,"contact_number":"9822221111"},
    {"doctor_id":"D018","name":"Dr. Pooja Khanna","username":"pooja_khanna","password":"pooja123","specialization":"Nutritionist","experience_years":5,"contact_number":"9866112233"},
    {"doctor_id":"D019","name":"Dr. Abhinav Rao","username":"abhinav_rao","password":"abhinav123","specialization":"Gastroenterologist","experience_years":12,"contact_number":"9845332211"},
    {"doctor_id":"D020","name":"Dr. Shalini Mishra","username":"shalini_mishra","password":"shalini123","specialization":"Pathologist","experience_years":10,"contact_number":"9876543120"}
];

async function importDoctors() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Doctor.deleteMany({});
    await Doctor.insertMany(doctors);
    console.log('Doctors imported successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

importDoctors();
