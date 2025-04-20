import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { CardContent, TextField, Button, Typography, InputAdornment, Alert } from '@mui/material';
import { AccountCircle, Phone, Email, Lock } from '@mui/icons-material';

const CreateAccount = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    fullname: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(''); // Error message state
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    if (!credentials.fullname.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!/^[a-zA-Z\s]*$/.test(credentials.fullname)) {
      setError('Name can only contain letters and spaces.');
      return;
    }

    if (!/^\d{10}$/.test(credentials.phone)) {
      setError('Phone number must contain exactly 10 digits.');
      return;
    }

    if (!credentials.email.trim() || !/\S+@\S+\.\S+/.test(credentials.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!credentials.password.trim() || credentials.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (credentials.password !== credentials.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Simulate account creation logic (e.g., API call)
    console.log('Creating account with:', credentials);

    // Redirect to the OTP verification page
    setError(''); // Clear error message
    navigate('/verify-email', { state: { email: credentials.email } }); // Pass email to OTP page
  };

  return (
    <div
      className="page_container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        padding: '0rem 0.5rem 0rem 0.5rem',
        justifyContent: 'center',
        overflow:'hidden'
      }}
    >
      <div className="flex items-center justify-center h-screen bg-white">
        <CardContent className="flex flex-col gap-4 p-6">
          <h1
            
            style={{ marginBottom: '1.5rem' }}
          >
            Create account
          </h1>

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
              placeholder='John Doe'
              sx={{ mb: 3 }}
              value={credentials.fullname}
              onChange={(e) => setCredentials({ ...credentials, fullname: e.target.value })}
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
              placeholder='0564785963'
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
              placeholder='johndoe@gmail.com'
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
              placeholder=''
              type="password"
              variant="outlined"
              fullWidth
              required
              sx={{ mb: 3 }}
              value={credentials.confirmPassword}
              onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
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
            required
            sx={{
              textTransform: 'none',
              marginTop: '2rem',
              backgroundColor: '#000', // Black background
              color: '#fff', // White text
              fontWeight:'bold',
              '&:hover': {
                backgroundColor: '#333', // Darker shade on hover
              },
            }}
          >
            Sign Up
          </Button>
        </CardContent>
      </div>
    </div>
  );
};

export default CreateAccount;