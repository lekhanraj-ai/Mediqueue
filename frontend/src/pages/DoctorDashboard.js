import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { LocalHospital } from '@mui/icons-material';
import api from '../api';

const timeSlots = [
  '9 AM - 11 AM',
  '12 PM - 2 PM',
  '3 PM - 5 PM'
];

const DoctorDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor;
  const [queues, setQueues] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);

  useEffect(() => {
    if (!doctor) {
      navigate('/login/doctor');
    }
  }, [doctor, navigate]);

  useEffect(() => {
    if (doctor) fetchQueues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctor]);

  const fetchQueues = async () => {
    setLoading(true);
    try {
      const result = {};
      const today = new Date();
      for (const slot of timeSlots) {
        const resp = await api.get(`/doctors/${doctor.doctor_id}/queue`, { params: { date: today.toISOString(), timeSlot: slot } });
        if (resp.data && resp.data.queue) result[slot] = resp.data.queue;
        else result[slot] = [];
      }
      setQueues(result);
    } catch (err) {
      console.error('Error fetching queues:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvance = async (apptId) => {
    try {
      await api.post(`/appointments/${apptId}/advance`);
      await fetchQueues();
    } catch (err) {
      console.error('Advance error:', err);
    }
  };

  if (!doctor) return null;

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <Paper elevation={8} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LocalHospital sx={{ fontSize: 48, color: '#1976d2' }} />
          <Box>
            <Typography variant="h5">Dr. {doctor.name}</Typography>
            <Typography variant="body2" color="text.secondary">{doctor.specialization} • {doctor.experience_years} yrs</Typography>
            <Typography variant="body2">Contact: {doctor.contact_number}</Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'right' }}>
            <Button variant="contained" color="primary" onClick={() => navigate('/login')}>Logout</Button>
          </Box>
        </Box>
      </Paper>

      {timeSlots.map(slot => (
        <Paper key={slot} elevation={4} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{slot}</Typography>
          <Divider sx={{ my: 1 }} />
          <List>
            {(queues[slot] || []).map(appt => (
              <ListItem key={appt._id} secondaryAction={appt.status === 'called' ? (
                <Button variant="contained" onClick={() => handleAdvance(appt._id)}>Finish</Button>
              ) : null} disableGutters>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: appt.status === 'called' ? '#4caf50' : '#90caf9' }}>{appt.tokenNumber}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${appt.patient_name} (${appt.age})`} secondary={`Status: ${appt.status}`} onClick={() => setSelectedAppt(appt)} />
              </ListItem>
            ))}
          </List>
        </Paper>
      ))}

      <Dialog open={!!selectedAppt} onClose={() => setSelectedAppt(null)}>
        <DialogTitle>Patient Details</DialogTitle>
        <DialogContent>
          {selectedAppt && (
            <Box>
              <Typography><strong>Name:</strong> {selectedAppt.patient_name}</Typography>
              <Typography><strong>Age:</strong> {selectedAppt.age}</Typography>
              <Typography><strong>Contact:</strong> {selectedAppt.contact_number}</Typography>
              <Typography><strong>Token:</strong> {selectedAppt.tokenNumber}</Typography>
              <Typography sx={{ mt: 1 }}><strong>Description:</strong> {selectedAppt.description}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedAppt(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorDashboard;
