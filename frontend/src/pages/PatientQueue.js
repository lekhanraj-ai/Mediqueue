import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Avatar, Stack, LinearProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const AvatarHead = ({ i }) => (
  <Avatar sx={{ width: 48, height: 48, bgcolor: '#90caf9', fontWeight: 700 }}>{i}</Avatar>
);

const PatientQueue = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointment = location.state?.appointment;
  const [position, setPosition] = useState(null);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const pollingRef = useRef(null);

  useEffect(() => {
    if (!appointment) return;

    const fetchQueue = async () => {
      setLoading(true);
      try {
        const resp = await api.get(`/doctors/${appointment.doctor_id}/queue`, {
          params: { date: new Date(appointment.date).toISOString(), timeSlot: appointment.timeSlot }
        });
        const q = resp.data.queue || [];
        setQueue(q);
        // compute people ahead: count pending/called tokens < user's tokenNumber
        const ahead = q.filter(a => (a.status !== 'served') && a.tokenNumber < appointment.tokenNumber).length;
        setPosition(ahead);
      } catch (err) {
        console.error('Failed to fetch queue', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
    pollingRef.current = setInterval(fetchQueue, 5000);
    return () => clearInterval(pollingRef.current);
  }, [appointment]);

  if (!appointment) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{ p: 4, textAlign: 'center' }} elevation={6}>
          <Typography variant="h6">No appointment selected</Typography>
          <Button sx={{ mt: 2 }} onClick={() => navigate('/login')}>Back to Login</Button>
        </Paper>
      </Box>
    );
  }

  const peopleAhead = position ?? (appointment.tokenNumber ? Math.max(appointment.tokenNumber - 1, 0) : 0);
  const totalSpots = 10;
  const percent = ((totalSpots - peopleAhead) / totalSpots) * 100;

  return (
    <Box sx={{ minHeight: '100vh', p: 3, background: 'linear-gradient(135deg,#e8f0fe 0%, #f3e5f5 100%)' }}>
      <Paper elevation={10} sx={{ maxWidth: 960, margin: '0 auto', p: 4, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 700, mb: 2 }}>Your Appointment Queue</Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Doctor: {appointment.doc_name}</Typography>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>Time Slot: {appointment.timeSlot} • Token: {appointment.tokenNumber}</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ mb: 1 }}>Queue progress</Typography>
            <LinearProgress variant="determinate" value={percent} sx={{ height: 12, borderRadius: 6 }} />
            <Typography variant="caption" color="text.secondary">{peopleAhead} people ahead of you</Typography>
          </Box>
          <Button variant="contained" onClick={() => navigate('/login')}>Back</Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <AnimatePresence>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              {Array.from({ length: peopleAhead }).map((_, idx) => (
                <motion.div key={idx} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.5, delay: idx * 0.08 }}>
                  <Avatar sx={{ width: 64, height: 64, bgcolor: '#81d4fa' }}>{/* placeholder */}</Avatar>
                </motion.div>
              ))}

              {/* the patient avatar */}
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: '#4fc3f7', fontSize: 20 }}>{appointment.patient_name ? appointment.patient_name.charAt(0).toUpperCase() : 'U'}</Avatar>
              </motion.div>
            </Stack>
          </AnimatePresence>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ mb: 1 }}><strong>{peopleAhead}</strong> people are ahead of you in the queue.</Typography>
          <Typography color="text.secondary">We'll keep updating your position automatically. Please wait — you'll be notified when it's your turn.</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default PatientQueue;
