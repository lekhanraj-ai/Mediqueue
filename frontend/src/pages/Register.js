import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Person,
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNo: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, phoneNo, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/user/register', {
        fullName,
        phoneNo,
        password,
      });
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const steps = ['Personal Info', 'Contact', 'Security'];

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <TextField
            margin="normal"
            required
            fullWidth
            id="fullName"
            label="Full Name"
            name="fullName"
            autoComplete="name"
            autoFocus
            value={formData.fullName}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="primary" />
                </InputAdornment>
              ),
            }}
          />
        );
      case 1:
        return (
          <TextField
            margin="normal"
            required
            fullWidth
            id="phoneNo"
            label="Phone Number"
            name="phoneNo"
            autoComplete="tel"
            value={formData.phoneNo}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone color="primary" />
                </InputAdornment>
              ),
            }}
          />
        );
      case 2:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
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
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <Paper
          elevation={8}
          sx={{
            marginTop: 8,
            padding: 4,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                color: '#1976d2',
                fontWeight: 600,
                marginBottom: 3,
                textAlign: 'center',
              }}
            >
              Create Account
            </Typography>

            <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <motion.div
                key={activeStep}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent(activeStep)}
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography color="error" align="center" sx={{ mt: 2 }}>
                    {error}
                  </Typography>
                </motion.div>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button onClick={handleBack} disabled={activeStep === 0} sx={{ mr: 1 }}>
                  Back
                </Button>
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        background: 'linear-gradient(45deg, #1976d2 30%, #64b5f6 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565c0 30%, #42a5f5 90%)',
                        },
                      }}
                    >
                      Complete Registration
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        background: 'linear-gradient(45deg, #1976d2 30%, #64b5f6 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565c0 30%, #42a5f5 90%)',
                        },
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Link
                  href="/login"
                  variant="body1"
                  sx={{
                    textDecoration: 'none',
                    color: '#1976d2',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Already have an account? Sign In
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Register;

