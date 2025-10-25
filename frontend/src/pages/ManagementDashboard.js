import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Card, CardContent, Typography, Button, Avatar, CircularProgress, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Chip, IconButton, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';
import api from '../api';

const DoctorCard = ({ d, onView }) => {
  const percent = Math.min(100, Math.round((d.waiting / 10) * 100));
  return (
    <Card component={motion.div} whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 220 }} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', p: 2, background: 'linear-gradient(135deg, rgba(25,118,210,0.03), rgba(3,169,244,0.02))' }}>
        <Avatar sx={{ bgcolor: '#1976d2', width: 72, height: 72, fontSize: 22, mr: 2 }}>{d.name ? d.name.charAt(0).toUpperCase() : 'D'}</Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>{d.name}</Typography>
          <Typography variant="body2" color="text.secondary">{d.specialization || 'General'}</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
            <Chip label={`Waiting: ${d.waiting}`} color={d.waiting > 6 ? 'error' : d.waiting > 3 ? 'warning' : 'success'} />
            <Chip label={`${percent}% capacity`} variant="outlined" />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
          <Box sx={{ position: 'relative', width: 72, height: 72 }}>
            <CircularProgress variant="determinate" value={percent} size={72} thickness={6} sx={{ color: percent > 70 ? '#d32f2f' : '#1976d2' }} />
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{d.waiting}</Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
            <Button size="small" variant="contained" onClick={() => onView(d)} startIcon={<InfoIcon />} sx={{ textTransform: 'none' }}>View</Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

const ManagementDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState([]);

  const [openDoctor, setOpenDoctor] = useState(null);
  const [doctorQueue, setDoctorQueue] = useState([]);
  const [search, setSearch] = useState('');

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

  useEffect(() => {
    const auth = localStorage.getItem('managementAuth');
    if (!auth) {
      navigate('/login/management');
      return;
    }
    fetchSummary();
    const interval = setInterval(fetchSummary, 7000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('managementAuth');
    localStorage.removeItem('managementUser');
    navigate('/login/management');
  };

  const handleView = async (doctor) => {
    setOpenDoctor(doctor);
    setDoctorQueue([]);
    try {
      const resp = await api.get(`/doctors/${doctor.doctor_id}/queue`, { params: { date: new Date().toISOString(), timeSlot: '' } });
      setDoctorQueue(resp.data.queue || []);
    } catch (err) {
      console.warn('Could not fetch detailed queue (timeSlot required by API). Showing empty list.');
      setDoctorQueue([]);
    }
  };

  const filtered = summary.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Management Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">Overview of doctors and live waiting counts</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField size="small" placeholder="Search doctors" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ bgcolor: 'white', borderRadius: 1 }} />
          <IconButton onClick={fetchSummary}><RefreshIcon /></IconButton>
          <Button variant="outlined" onClick={handleLogout}>Logout</Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((d) => (
            <Grid item xs={12} sm={6} md={4} key={d.doctor_id}>
              <DoctorCard d={d} onView={handleView} />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={!!openDoctor} onClose={() => setOpenDoctor(null)} fullWidth maxWidth="sm">
        <DialogTitle>{openDoctor ? `Queue for Dr. ${openDoctor.name}` : 'Queue'}</DialogTitle>
        <DialogContent>
          {doctorQueue.length === 0 ? (
            <Typography color="text.secondary">No detailed queue available (timeSlot-specific endpoint required).</Typography>
          ) : (
            <List>
              {doctorQueue.map((q) => (
                <ListItem key={q._id} divider>
                  <ListItemText primary={`Token ${q.tokenNumber}: ${q.patient_name}`} secondary={`Status: ${q.status}`} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ManagementDashboard;
