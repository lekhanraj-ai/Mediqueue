import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button } from '@mui/material';
import { LocalHospital } from '@mui/icons-material';
import { useEffect } from 'react';

const DoctorDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor;

  useEffect(() => {
    if (!doctor) {
      navigate('/login/doctor');
    }
  }, [doctor, navigate]);

  if (!doctor) return null;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={8} sx={{ p: 5, borderRadius: 3, minWidth: 350, textAlign: 'center' }}>
        <LocalHospital sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
        <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 600, mb: 2 }}>
          Welcome, {doctor.name}!
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Specialization: {doctor.specialization}
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Experience: {doctor.experience_years} years
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Contact: {doctor.contact_number}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/login')}>Logout</Button>
      </Paper>
    </Box>
  );
};

export default DoctorDashboard;
