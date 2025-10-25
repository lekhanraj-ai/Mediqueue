import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Stack, Alert, InputAdornment } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { motion } from 'framer-motion';
import api from '../api';

const ManagementLogin = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Call backend management login for validation
      const resp = await api.post('/management/login', { user_id: userId, password });
      if (resp.status === 200) {
        // store simple management auth token in localStorage
        localStorage.setItem('managementAuth', 'true');
        localStorage.setItem('managementUser', JSON.stringify(resp.data.user || { user_id: userId }));
        // Use full navigation to ensure route guard picks up the new localStorage value
        window.location.href = '/management/dashboard';
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      // Fallback to client-side check if backend unavailable
      if (userId === 'admin' && password === 'admin123') {
        localStorage.setItem('managementAuth', 'true');
        // ensure navigation works reliably
        window.location.href = '/management/dashboard';
      } else {
        setError(err.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      <Paper component={motion.div} initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.35 }} elevation={12} sx={{ maxWidth: 520, width: '100%', p: 4, borderRadius: 3, backdropFilter: 'blur(6px)', backgroundColor: 'rgba(255,255,255,0.9)' }}>
        <Typography variant="h5" sx={{ mb: 2, color: '#0d47a1', fontWeight: 700 }}>Management Login</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              fullWidth
              required
              InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircleIcon /></InputAdornment>) }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon /></InputAdornment>) }}
            />

            <Button variant="contained" type="submit" disabled={loading} sx={{ mt: 1, background: 'linear-gradient(45deg,#1976d2 30%, #42a5f5 90%)' }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <Button variant="text" onClick={() => { setUserId('admin'); setPassword('admin123'); }}>
              Autofill (demo)
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default ManagementLogin;
