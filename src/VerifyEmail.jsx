import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { Box, Typography, TextField, Button, Alert, Link } from '@mui/material';
import axios from 'axios'; // For making API calls

const VerifyEmail = () => {
  const [otp, setOtp] = useState(Array(6).fill('')); // Array of 6 empty strings
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60); // Countdown timer (60 seconds)
  const inputRefs = useRef([]); // Refs for all input fields
  const navigate = useNavigate(); // Initialize useNavigate
  const email = new URLSearchParams(window.location.search).get('email'); // Extract email from query parameters

  // Initialize refs dynamically
  useEffect(() => {
    inputRefs.current = otp.map((_, index) => inputRefs.current[index] || null);
  }, []);

  // Start countdown timer
  useEffect(() => {
    if (countdown > 0 && resendDisabled) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup the timer
    } else if (countdown === 0) {
      setResendDisabled(false); // Enable resend after countdown ends
    }
  }, [countdown, resendDisabled]);

  // Handle OTP input
  const handleInputChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    // Update state
    setOtp(newOtp);

    // Move focus to the next input if a value is entered
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Combine OTP digits into a single string
    const fullOtp = newOtp.join('');
    if (fullOtp.length === 6) {
      handleSubmit(fullOtp);
    }
  };

  // Submit OTP to backend API
  const handleSubmit = async (enteredOtp) => {
    setError(''); // Reset error message
    setSuccess(false);

    try {
      // Make POST request to the backend API
      const response = await axios.post('http://13.51.167.118/accounts/api/verify-otp', {
        email: email, // Pass the email from query parameters
        otp: enteredOtp, // Pass the entered OTP
      });

      console.log('OTP verified successfully:', response.data);

      // Mark as successful and navigate to the ID Verification page
      setSuccess(true);
      setTimeout(() => {
        navigate('/id-verification'); // Redirect to the ID Verification page
      }, 1000); // Optional delay for better UX
    } catch (err) {
      console.error('Error verifying OTP:', err);

      if (err.response) {
        // Log the full error response for debugging
        console.error('Backend error response:', err.response.data);

        if (err.response.status === 400) {
          setError('Invalid verification code. Please try again.');
        } else if (err.response.status === 404) {
          setError('Email not found. Please sign up or try again.');
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      } else {
        setError('Unable to connect to the server. Please check your internet connection.');
      }
    }
  };

  // Simulate resending the verification code
  const handleResendCode = async () => {
    setError('');
    setCountdown(60); // Reset countdown
    setResendDisabled(true); // Disable resend button again

    try {
      // Make POST request to resend OTP
      const response = await axios.post('http://13.51.167.118/accounts/api/resend-otp', {
        email: email, // Pass the email from query parameters
      });

      console.log('Verification code resent successfully:', response.data);
    } catch (err) {
      console.error('Error resending OTP:', err);

      if (err.response) {
        console.error('Backend error response:', err.response.data);
        setError('Failed to resend verification code. Please try again later.');
      } else {
        setError('Unable to connect to the server. Please check your internet connection.');
      }
    }
  };

  return (
    <Box
      className="page_container"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '400px',
          padding: '2.5rem',
          bgcolor: 'transparent',
          borderRadius: '12px',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom fontWeight="600">
          Verify Your Email
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 2, mt: 2 }}>
          Enter the code sent to your email address.
        </Typography>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Success Message */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Email verified!
          </Alert>
        )}

        {/* OTP Input Fields */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          {otp.map((digit, index) => (
            <TextField
              key={index}
              type="text"
              inputProps={{
                maxLength: 1, // Only allow one character per field
                style: { textAlign: 'center' },
              }}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onFocus={(e) => e.target.select()}
              inputRef={(el) => (inputRefs.current[index] = el)}
              sx={{
                width: '45px',
                height: '58px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  textAlign: 'center',
                },
              }}
            />
          ))}
        </Box>

        {/* Verify Button */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          disabled={success} // Disable button after successful verification
          sx={{
            fontWeight: 'bold',
            textTransform: 'none',
            backgroundColor: '#000',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
        >
          Verify
        </Button>

        {/* Resend Code Section */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          {resendDisabled ? (
            <Typography variant="body2">
              Resend code in {countdown} seconds
            </Typography>
          ) : (
            <Link
              component="button"
              variant="body2"
              onClick={handleResendCode}
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              Resend Code
            </Link>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default VerifyEmail;