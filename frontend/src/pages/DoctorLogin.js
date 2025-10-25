import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { Badge, Lock, Visibility, VisibilityOff, LocalHospital } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../api';

const DoctorLogin = () => {
  const [formData, setFormData] = useState({
    doctor_id: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // Remove /api prefix, use proxy or env baseURL
      const response = await api.post('/doctor/login', formData);
      setSuccess(response.data.message);
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        navigate('/doctor/dashboard', { state: { doctor: response.data.doctor } });
      }, 1200);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
      setOpen(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <Container component="main" maxWidth="xs">
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <Paper
          elevation={8}
          sx={{
            marginTop: 8,
            padding: 4,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <LocalHospital sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
            <Typography component="h1" variant="h4" sx={{ color: '#1976d2', fontWeight: 600, mb: 2 }}>
              Doctor Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="doctor_id"
                label="Doctor ID"
                name="doctor_id"
                autoComplete="off"
                autoFocus
                value={formData.doctor_id}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #1976d2 30%, #43cea2 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0 30%, #185a9d 90%)',
                  },
                }}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Paper>
        <Snackbar open={open} autoHideDuration={2000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          {success ? (
            <Alert severity="success" sx={{ width: '100%' }}>{success}</Alert>
          ) : error ? (
            <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
          ) : null}
        </Snackbar>
      </motion.div>
    </Container>
  );
};

export default DoctorLogin;
