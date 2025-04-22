import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate for navigation
import { Box, CardContent, TextField, Button, Typography, InputAdornment, Alert } from '@mui/material';
import { AccountCircle, Phone, Email, Lock } from '@mui/icons-material';
import axios from 'axios'; // For making API calls

const CreateAccount = () => {
  const [credentials, setCredentials] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [error, setError] = useState(''); // Error message state
  const [loading, setLoading] = useState(false); // Loading state for API call
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error and loading states
    setError('');
    setLoading(true);

    // Validate form fields
    if (!credentials.full_name.trim()) {
      setError('Please enter your full name.');
      setLoading(false);
      return;
    }

    if (!/^[a-zA-Z\s]*$/.test(credentials.full_name)) {
      setError('Name can only contain letters and spaces.');
      setLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(credentials.phone)) {
      setError('Phone number must contain exactly 10 digits.');
      setLoading(false);
      return;
    }

    if (!credentials.email.trim() || !/\S+@\S+\.\S+/.test(credentials.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (!credentials.password.trim() || credentials.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (credentials.password !== credentials.confirm_password) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      // Make POST request to the backend API
      const response = await axios.post('http://13.51.167.118/accounts/api/signup', {
        name: credentials.full_name,
        phone: credentials.phone,
        email: credentials.email,
        password: credentials.password,
      });

      console.log('Account created successfully:', response.data);

      // Redirect to the OTP verification page
      navigate('/verify-email', { state: { email: credentials.email } }); // Pass email to OTP page
    } catch (err) {
      console.error('Error during account creation:', err);

      if (err.response) {
        // Log the full error response for debugging
        console.error('Backend error response:', err.response.data);

        if (err.response.status === 400) {
          setError('Invalid input. Please check your details and try again.');
        } else if (err.response.status === 409) {
          setError('An account with this email already exists.');
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      } else {
        setError('Unable to connect to the server. Please check your internet connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="page_container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        padding: '0rem 0.5rem 0rem 0.5rem',
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center',
      }}
    >
      <Box className="flex items-center justify-center h-screen bg-white">
        <CardContent className="flex flex-col gap-4 p-6">
          <h1 style={{ marginBottom: '1.5rem' }}>Create account</h1>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <TextField
              label="Full Name"
              type="text"
              variant="outlined"
              fullWidth
              required
              placeholder="John Doe"
              sx={{ mb: 3 }}
              value={credentials.fullname}
              onChange={(e) => setCredentials({ ...credentials, full_name: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />

            {/* Phone Number Field */}
            <TextField
              label="Phone Number"
              type="tel"
              variant="outlined"
              fullWidth
              required
              placeholder="0564785963"
              sx={{ mb: 3 }}
              value={credentials.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Allow only numbers
                setCredentials({ ...credentials, phone: value });
              }}
              inputProps={{
                maxLength: 10, // Limit to 10 digits
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                ),
              }}
            />

            {/* Email Field */}
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              placeholder="johndoe@gmail.com"
              sx={{ mb: 3 }}
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Field */}
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              placeholder="******"
              required
              sx={{ mb: 3 }}
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />

            {/* Confirm Password Field */}
            <TextField
              label="Confirm Password"
              placeholder="******"
              type="password"
              variant="outlined"
              fullWidth
              required
              sx={{ mb: 3 }}
              value={credentials.confirmPassword}
              onChange={(e) => setCredentials({ ...credentials, confirm_password: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />
          </form>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading} // Disable button while loading
            sx={{
              textTransform: 'none',
              marginTop: '1rem',
              backgroundColor: '#000', 
              color: '#fff', 
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#333', 
              },
            }}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>

          <Typography
            variant="body2"
            sx={{
              mt: 2,
              textAlign: 'center',
              color: 'rgba(0, 0, 0, 0.6)',
              '& a': {
                color: 'blue',
                fontWeight: 'bold',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
            }}
          >
            Already have an account?{' '}
            <Link to="/">Sign in</Link>
          </Typography>
        </CardContent>
      </Box>
    </Box>
  );
};

export default CreateAccount;