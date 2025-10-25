import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  DialogContentText,
  Avatar,
  Stack,
} from '@mui/material';
import { AccessTime, ContactPhone } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../api';

const timeSlots = [
  { id: 1, time: '9 AM - 11 AM' },
  { id: 2, time: '12 PM - 2 PM' },
  { id: 3, time: '3 PM - 5 PM' },
];

const PatientDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [doctors, setDoctors] = useState([]);

  // Redirect if no user data
  useEffect(() => {
    if (!user) {
      navigate('/login/patient');
    }
  }, [user, navigate]);
  const [bookingData, setBookingData] = useState({
    patientName: '',
    age: '',
    mobileNumber: '',
    selectedDoctor: '',
    description: '',
    doctorName: ''
  });

  // Reset form data when dialog closes
  const handleDialogClose = () => {
    setBookingData({
      patientName: '',
      age: '',
      mobileNumber: '',
      selectedDoctor: '',
      description: '',
      doctorName: ''
    });
    setBookingError('');
    setOpenBookingDialog(false);
  };
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Fetch doctors when component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        if (response.data) {
          setDoctors(response.data);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        alert('Failed to load doctors list. Please refresh the page.');
      }
    };
    fetchDoctors();
  }, []);

  const handleBookSlot = () => {
    setShowTimeSlots(true);
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setBookingError('');
    setOpenBookingDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value,
    }));
    setBookingError(''); // Clear any previous errors when user makes changes
  };

  const validateForm = () => {
    // Clear any previous error
    setBookingError('');
    
    // Get the selected doctor object
    const selectedDoctor = doctors.find(d => d.doctor_id === bookingData.selectedDoctor);
    
  const validations = [
      {
        condition: !bookingData.patientName.trim(),
        message: 'Patient name is required'
      },
      {
        condition: !bookingData.age || bookingData.age < 1 || bookingData.age > 150,
        message: 'Please enter a valid age between 1 and 150'
      },
      {
        condition: !bookingData.mobileNumber || !/^\d{10}$/.test(bookingData.mobileNumber),
        message: 'Please enter a valid 10-digit mobile number'
      },
      {
        condition: !bookingData.selectedDoctor || !selectedDoctor,
        message: 'Please select a doctor'
      },
      {
        condition: !selectedSlot,
        message: 'Please select a time slot'
      },
      {
        condition: !bookingData.description.trim(),
        message: 'Please provide a description of the problem'
      }
    ];

    for (const validation of validations) {
      if (validation.condition) {
        setBookingError(validation.message);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      // Log the selected slot and booking data
      console.log('Selected slot:', selectedSlot);
      console.log('Booking data:', bookingData);

      try {
        const selectedDoctor = doctors.find(d => d.doctor_id === bookingData.selectedDoctor);
        
        // Match backend expected field names
        const appointmentData = {
          patient_name: bookingData.patientName.trim(),
          age: String(parseInt(bookingData.age)),
          contact_number: bookingData.mobileNumber.trim(),
          doc_name: selectedDoctor.name,
          doctor_id: selectedDoctor.doctor_id,
          date: new Date().toISOString(),
          timeSlot: selectedSlot.time,
          description: bookingData.description.trim()
        };

        console.log('Sending appointment data:', appointmentData);

        const response = await api.post('/appointments', appointmentData);
        console.log('Server response:', response.data);

        if (response.data && response.data.appointment) {
          // Store the doctor name and token for display in confirmation
          setBookingData(prev => ({
            ...prev,
            doctorName: selectedDoctor.name,
            tokenNumber: response.data.appointment.tokenNumber
          }));

          // Clear error and show confirmation
          setBookingError('');
          setOpenBookingDialog(false);
          setOpenConfirmDialog(true);
        } else {
          setBookingError('Server error: Invalid response');
        }
      } catch (error) {
        console.error('API error:', error);
        setBookingError(error.response?.data?.message || 'Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      console.error('Error response:', error.response);
      if (error.response) {
        setBookingError(error.response.data?.message || 'Server error. Please try again.');
      } else if (error.request) {
        setBookingError('Network error. Please check your connection.');
      } else {
        setBookingError('Error booking appointment. Please try again.');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        padding: 3,
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={8}
          sx={{
            maxWidth: 800,
            margin: '0 auto',
            padding: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="h4" sx={{ mb: 4, color: '#1976d2', fontWeight: 600, textAlign: 'center' }}>
            Welcome to MediQueue
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AccessTime />}
                onClick={handleBookSlot}
                sx={{
                  py: 2,
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                  },
                }}
              >
                Book Your Slot
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<ContactPhone />}
                color="secondary"
                sx={{
                  py: 2,
                  background: 'linear-gradient(45deg, #9c27b0 30%, #ba68c8 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #7b1fa2 30%, #9c27b0 90%)',
                  },
                }}
              >
                Contact Us
              </Button>
            </Grid>
          </Grid>

          {showTimeSlots && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h6" sx={{ mt: 4, mb: 3, textAlign: 'center' }}>
                Available Time Slots
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                {timeSlots.map((slot) => (
                  <Grid item xs={12} sm={4} key={slot.id}>
                    <Card
                      component={motion.div}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleTimeSlotSelect(slot)}
                    >
                      <CardContent sx={{ textAlign: 'center' }}>
                        <AccessTime color="primary" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h6">{slot.time}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
        </Paper>

        {/* Booking Form Dialog */}
        <Dialog
          open={openBookingDialog}
          maxWidth="sm"
          fullWidth
          onClose={handleDialogClose}
          PaperProps={{
            sx: {
              width: '100%',
              maxWidth: 600,
              p: 2
            }
          }}
        >
          <DialogTitle>
            Book Appointment{selectedSlot ? ` — ${selectedSlot.time}` : ''}
          </DialogTitle>
            <DialogContent>
              {bookingError && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {bookingError}
                </Typography>
              )}
              <TextField
                margin="dense"
                name="patientName"
                label="Patient Name"
                fullWidth
                required
                value={bookingData.patientName}
                onChange={handleInputChange}
                error={bookingError && !bookingData.patientName.trim()}
                helperText={bookingError && !bookingData.patientName.trim() ? "Patient name is required" : ""}
                inputProps={{
                  maxLength: 50
                }}
              />
            <TextField
              margin="dense"
              name="age"
              label="Age"
              type="number"
              fullWidth
              required
              value={bookingData.age}
              onChange={handleInputChange}
              error={bookingError && (!bookingData.age || bookingData.age < 1)}
              helperText={bookingError && (!bookingData.age || bookingData.age < 1) ? "Please enter a valid age" : ""}
              inputProps={{
                min: 1,
                max: 150
              }}
            />
            <TextField
              margin="dense"
              name="mobileNumber"
              label="Mobile Number"
              fullWidth
              required
              value={bookingData.mobileNumber}
              onChange={handleInputChange}
              error={bookingError && (!bookingData.mobileNumber || !/^\d{10}$/.test(bookingData.mobileNumber))}
              helperText={bookingError && (!bookingData.mobileNumber || !/^\d{10}$/.test(bookingData.mobileNumber)) 
                ? "Please enter a valid 10-digit mobile number" 
                : ""}
              inputProps={{
                maxLength: 10,
                pattern: "[0-9]*"
              }}
            />
            <FormControl fullWidth margin="dense" required error={bookingError && !bookingData.selectedDoctor}>
              <InputLabel>Select Doctor</InputLabel>
              <Select
                name="selectedDoctor"
                value={bookingData.selectedDoctor}
                onChange={handleInputChange}
                label="Select Doctor"
                error={bookingError && !bookingData.selectedDoctor}
                MenuProps={{
                  PaperProps: {
                    sx: { maxHeight: 300 }
                  }
                }}
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.doctor_id} value={doctor.doctor_id}>
                    {doctor.name} - {doctor.specialization}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="description"
              label="Description of the Problem"
              fullWidth
              required
              multiline
              rows={4}
              value={bookingData.description}
              onChange={handleInputChange}
              error={bookingError && !bookingData.description.trim()}
              helperText={bookingError && !bookingData.description.trim() ? "Please describe your medical condition" : ""}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" disabled={!selectedSlot}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
        >
          <DialogTitle>Booking Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Your appointment has been booked successfully!
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Your token: {bookingData.tokenNumber || 'N/A'}</Typography>
                {bookingData.tokenNumber ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">People ahead:</Typography>
                    <Stack direction="row" spacing={1}>
                      {Array.from({ length: Math.min((bookingData.tokenNumber - 1) || 0, 9) }).map((_, i) => (
                        <Avatar key={i} sx={{ width: 28, height: 28, bgcolor: '#90caf9' }}>{i+1}</Avatar>
                      ))}
                    </Stack>
                    <Typography sx={{ ml: 2, color: 'text.secondary' }}>{Math.max((bookingData.tokenNumber - 1), 0)} ahead</Typography>
                  </Box>
                ) : null}
                <Typography><strong>Time Slot:</strong> {selectedSlot?.time}</Typography>
                <Typography><strong>Patient Name:</strong> {bookingData.patientName}</Typography>
                <Typography><strong>Age:</strong> {bookingData.age}</Typography>
                <Typography><strong>Mobile Number:</strong> {bookingData.mobileNumber}</Typography>
                <Typography><strong>Doctor:</strong> {bookingData.doctorName || 'Not specified'}</Typography>
                <Typography><strong>Description:</strong> {bookingData.description}</Typography>
                <Typography sx={{ mt: 2, color: 'success.main', fontWeight: 'bold' }}>
                  Your appointment has been confirmed! Please arrive 15 minutes before your scheduled time.
                </Typography>
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenConfirmDialog(false);
                setShowTimeSlots(false);
                setSelectedSlot(null);
                setBookingData({
                  patientName: '',
                  age: '',
                  mobileNumber: '',
                  selectedDoctor: '',
                  description: '',
                });
              }}
              variant="outlined"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                // navigate to the animated queue page with appointment info
                const appt = bookingData.tokenNumber ? {
                  patient_name: bookingData.patientName,
                  tokenNumber: bookingData.tokenNumber,
                  doc_name: bookingData.doctorName,
                  doctor_id: bookingData.selectedDoctor,
                  timeSlot: selectedSlot?.time,
                  date: new Date().toISOString()
                } : null;
                if (appt) {
                  // close dialog and go to queue page
                  setOpenConfirmDialog(false);
                  navigate('/patient/queue', { state: { appointment: appt } });
                }
              }}
              variant="contained"
            >
              View Queue
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Box>
  );
};

export default PatientDashboard;