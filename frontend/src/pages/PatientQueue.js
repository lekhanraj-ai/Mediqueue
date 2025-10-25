import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Avatar, Stack, LinearProgress, Snackbar, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import api from '../api';

// Animation variants for queue items
const queueItemVariants = {
  initial: { 
    scale: 0.8, 
    y: -20, 
    opacity: 0,
    rotateY: -30
  },
  animate: { 
    scale: 1, 
    y: 0, 
    opacity: 1,
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  },
  exit: { 
    scale: 0.8, 
    y: 20, 
    opacity: 0,
    rotateY: 30,
    transition: {
      duration: 0.3
    }
  },
  hover: {
    scale: 1.1,
    rotate: [0, -10, 10, -10, 0],
    transition: {
      duration: 0.5
    }
  }
};

const AvatarHead = ({ index, total }) => (
  <motion.div
    variants={queueItemVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    whileHover="hover"
    custom={index}
    style={{
      position: 'relative'
    }}
  >
    <Avatar 
      sx={{ 
        width: 64, 
        height: 64, 
        bgcolor: '#81d4fa',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        border: '3px solid #fff'
      }}
    >
      {total - index}
    </Avatar>
    <motion.div
      style={{
        position: 'absolute',
        bottom: -10,
        left: '50%',
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: '#4fc3f7',
        transform: 'translateX(-50%)'
      }}
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay: index * 0.2
      }}
    />
  </motion.div>
);

const PatientQueue = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointment = location.state?.appointment;
  const [position, setPosition] = useState(null);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const socketRef = useRef(null);
  const pollingRef = useRef(null);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!appointment) return;

    socketRef.current = io('http://localhost:5000');
    
    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
      socketRef.current.emit('joinDoctorQueue', appointment.doctor_id);
      socketRef.current.emit('joinAppointment', appointment._id);
    });

    socketRef.current.on('queueUpdate', (data) => {
      fetchQueue(); // Refresh queue on any update
    });

    socketRef.current.on('appointmentCalled', (data) => {
      if (data.appointment._id === appointment._id) {
        setNotification("It's your turn! Please proceed to the doctor's office.");
        // Browser notification
        if (Notification.permission === "granted") {
          new Notification("It's Your Turn!", {
            body: "Please proceed to the doctor's office",
            icon: "/favicon.ico"
          });
        }
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [appointment]);

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

  useEffect(() => {
    if (!appointment) return;

    fetchQueue();
    pollingRef.current = setInterval(fetchQueue, 5000); // Fallback polling
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
    <Box 
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{ 
        minHeight: '100vh', 
        p: 3, 
        background: 'linear-gradient(135deg,#e8f0fe 0%, #f3e5f5 100%)',
        overflow: 'hidden'
      }}
    >
      <Paper 
        component={motion.div}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        elevation={10} 
        sx={{ 
          maxWidth: 960, 
          margin: '0 auto', 
          p: 4, 
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Typography 
          variant="h4" 
          component={motion.h4}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          sx={{ color: '#1976d2', fontWeight: 700, mb: 2 }}
        >
          Your Appointment Queue
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Doctor: {appointment.doc_name}</Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Time Slot: {appointment.timeSlot} • Token: {appointment.tokenNumber}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ mb: 1 }}>Queue progress</Typography>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <LinearProgress 
                variant="determinate" 
                value={percent} 
                sx={{ 
                  height: 12, 
                  borderRadius: 6,
                  '& .MuiLinearProgress-bar': {
                    transition: 'transform 0.8s ease-in-out'
                  }
                }} 
              />
            </motion.div>
            <Typography variant="caption" color="text.secondary">
              {peopleAhead} people ahead of you
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            onClick={() => navigate('/login')}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            Back
          </Button>
        </Box>

        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 4,
            perspective: '1000px'
          }}
        >
          <AnimatePresence mode="popLayout">
            <Stack 
              direction="row" 
              spacing={2} 
              sx={{ 
                alignItems: 'center',
                position: 'relative'
              }}
            >
              {/* People ahead in queue */}
              {Array.from({ length: peopleAhead }).map((_, idx) => (
                <AvatarHead key={`ahead-${idx}`} index={idx} total={peopleAhead} />
              ))}

              {/* Current patient avatar */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  y: [0, -10, 0],
                }}
                transition={{
                  y: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: '#4fc3f7', 
                    fontSize: 24,
                    border: '4px solid #fff',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                  }}
                >
                  {appointment.patient_name ? appointment.patient_name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </motion.div>
            </Stack>
          </AnimatePresence>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            <strong>{peopleAhead}</strong> people are ahead of you in the queue
          </Typography>
          <Typography color="text.secondary">
            We'll keep updating your position automatically. Please wait — you'll be notified when it's your turn.
          </Typography>
        </Box>

        {/* Loading overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255,255,255,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CircularProgress />
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>

      {/* Notifications */}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
        message={notification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default PatientQueue;
