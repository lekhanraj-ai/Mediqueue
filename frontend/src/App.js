import { useState } from 'react';
import bgImage from './assets/bg.jpg';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Button, Typography } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import SplashScreen from './components/SplashScreen';
import LoginMenu from './pages/LoginMenu';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorLogin from './pages/DoctorLogin';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import PatientQueue from './pages/PatientQueue';
import ManagementLogin from './pages/ManagementLogin';
import ManagementDashboard from './pages/ManagementDashboard';
import theme from './theme';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          // Use bg image from src/assets/bg.jpg (imported above) so it is bundled with the app
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      >
        <AuthProvider>
          <Router>
            {/* Top navigation for management and doctor login */}
            <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(6px)' }}>
              <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>MediQueue</Typography>
                <Box>
                  <Button color="inherit" onClick={() => window.location.href = '/login/doctor'} sx={{ color: '#fff', mr: 1 }}>Doctor Login</Button>
                  <Button color="inherit" onClick={() => window.location.href = '/login/management'} sx={{ color: '#fff' }}>Management Login</Button>
                </Box>
              </Toolbar>
            </AppBar>

            <Routes>
              <Route path="/login" element={<LoginMenu />} />
              <Route path="/login/patient" element={<Login />} />
              <Route path="/login/doctor" element={<DoctorLogin />} />
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/patient/PatientDashboard" element={<PatientDashboard />} />
              <Route path="/patient/queue" element={<PatientQueue />} />
              <Route path="/login/management" element={<ManagementLogin />} />
              <Route
                path="/management/dashboard"
                element={localStorage.getItem('managementAuth') ? <ManagementDashboard /> : <Navigate to="/login/management" />}
              />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </Router>
        </AuthProvider>
        {/* Splash overlay: keep mounted on top while showSplash is true */}
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </Box>
    </ThemeProvider>
  );
}

export default App;
