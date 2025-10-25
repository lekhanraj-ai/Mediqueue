import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { PulseLoader } from 'react-spinners';
import logo from '../assets/logo.svg'; // placeholder svg logo

 const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
        zIndex: 9999,
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <img
          src={logo}
          alt="MediQueue Logo"
          style={{
            width: '200px',
            height: 'auto',
            marginBottom: '20px',
            filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))'
          }}
        />
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            color: '#ffffff',
            fontWeight: 600,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
            marginBottom: '20px'
          }}
        >
          MediQueue
        </Typography>
      </motion.div>
      <PulseLoader color="#ffffff" size={10} margin={5} />
    </Box>
  );
 }
export default SplashScreen;