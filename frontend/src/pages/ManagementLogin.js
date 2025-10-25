import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, InputAdornment } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { motion } from 'framer-motion';

const ManagementLogin = () => {
  const navigate = useNavigate();
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // simple client-side check as requested
    if (userid === 'admin' && password === 'admin123') {
      sessionStorage.setItem('managementAuth', 'true');
      navigate('/management/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper component={motion.div} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} elevation={8} sx={{ width: 420, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: '#1976d2' }}>Management Login</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Enter management credentials to view queue summary.</Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="User ID"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircleIcon /></InputAdornment>) }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>) }}
          />

          {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}

          <Button type="submit" variant="contained" fullWidth size="large" sx={{ background: 'linear-gradient(90deg,#1976d2,#21cbf3)' }}>
            Sign in
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ManagementLogin;
