import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link for navigation
import { Box, CardContent, TextField, Button, Typography, InputAdornment, Alert } from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import axios from 'axios'; // For making API calls

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(''); // Error message state
  const [loading, setLoading] = useState(false); // Loading state for API call
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!credentials.email.trim() || !/\S+@\S+\.\S+/.test(credentials.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!credentials.password.trim() || credentials.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setError(''); // Clear previous errors
      setLoading(true); 

      // Make POST request to the backend API
      const response = await axios.post('http://13.51.167.118/accounts/api/login', {
        email: credentials.email,
        password: credentials.password,
      });
      // Handle successful login
      console.log('Login successful:', response.data);
      setLoading(false); // Reset loading state

      // Redirect to the homepage or dashboard
      navigate('/homepage', { state: { email: credentials.email } });
    } catch (err) {
      setLoading(false); // Reset loading state

      // Handle API errors
      if (err.response && err.response.status === 400) {
        setError('Invalid email or password.');
      } else {
        setError('An error occurred. Please try again later.');
      }
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
          <h1 style={{ marginBottom: '1.5rem' }}>Login</h1>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
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
              backgroundColor: '#000', 
              color: '#fff', 
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#333', 
              },
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Don't have an account? Sign up */}
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
            Don't have an account?{' '}
            <Link to="/create-account">Sign Up</Link>
          </Typography>
        </CardContent>
      </Box>
    </Box>
  );
};

export default Login;