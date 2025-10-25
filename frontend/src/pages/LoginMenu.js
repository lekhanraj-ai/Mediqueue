import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const LoginMenu = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
        <Paper elevation={8} sx={{ p: 5, borderRadius: 3, minWidth: 320, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 4, color: '#1976d2', fontWeight: 600 }}>
            Select Login Type
          </Typography>
          <Stack spacing={3}>
            <Button variant="contained" size="large" onClick={() => navigate('/login/patient')} sx={{ fontWeight: 600 }}>
              Patient Login
            </Button>
            <Button variant="contained" size="large" color="secondary" onClick={() => navigate('/login/doctor')} sx={{ fontWeight: 600, background: 'linear-gradient(90deg,#43cea2,#185a9d)' }}>
              Doctor Login
            </Button>
            <Button variant="contained" size="large" color="success" onClick={() => navigate('/login/management')} sx={{ fontWeight: 600, background: 'linear-gradient(90deg,#f7971e,#ffd200)' }}>
              Management Login
            </Button>
          </Stack>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default LoginMenu;
