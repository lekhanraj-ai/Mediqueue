import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Card, CardContent, Typography, Button, Avatar, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import api from '../api';

const DoctorCard = ({ d }) => (
  <Card component={motion.div} whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 220 }} sx={{ borderRadius: 3 }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar sx={{ bgcolor: '#1976d2', width: 64, height: 64, fontSize: 20 }}>{d.name ? d.name.charAt(0).toUpperCase() : 'D'}</Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{d.name}</Typography>
        <Typography variant="body2" color="text.secondary">{d.specialization || 'General'}</Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>{d.waiting}</Typography>
        <Typography variant="caption" color="text.secondary">waiting</Typography>
      </Box>
    </CardContent>
  </Card>
);

const ManagementDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    const auth = localStorage.getItem('managementAuth');
    if (!auth) {
      navigate('/login/management');
      return;
    }

    const fetchSummary = async () => {
      setLoading(true);
      try {
        const resp = await api.get('/management/queues');
        setSummary(resp.data.summary || []);
      } catch (err) {
        console.error('Failed to fetch management summary', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();

    const interval = setInterval(fetchSummary, 7000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('managementAuth');
    localStorage.removeItem('managementUser');
    navigate('/login/management');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Management Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">Overview of all doctors and their waiting counts</Typography>
        </Box>
        <Box>
          <Button variant="outlined" onClick={handleLogout}>Logout</Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {summary.map((d) => (
            <Grid item xs={12} sm={6} md={4} key={d.doctor_id}>
              <DoctorCard d={d} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ManagementDashboard;
