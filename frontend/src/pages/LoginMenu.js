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
            Patient Portal
          </Typography>
          <Stack spacing={3}>
            <Button variant="contained" size="large" onClick={() => navigate('/login/patient')} sx={{ fontWeight: 600 }}>
              Patient Login
            </Button>
          </Stack>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default LoginMenu;
