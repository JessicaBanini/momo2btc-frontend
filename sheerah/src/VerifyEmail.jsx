import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
} from '@mui/material';

const VerifyEmail = () => {
  const [otp, setOtp] = useState(Array(4).fill('')); // Array of 4 empty strings
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60); // Countdown timer (60 seconds)
  const inputRefs = useRef([]); // Refs for all input fields
  const navigate = useNavigate(); // Initialize useNavigate

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
    if (fullOtp.length === 4) {
      handleSubmit(fullOtp);
    }
  };

  // Simulate backend verification logic
  const handleSubmit = (enteredOtp) => {
    setError(''); // Reset error message

    // Example: Simulate a valid OTP (e.g., "1234")
    if (enteredOtp === '1234') {
      setSuccess(true);
      setError('');

      // Navigate to the ID Verification page after a short delay
      setTimeout(() => {
        navigate('/id-verification'); // Redirect to the ID Verification page
      }, 1000); // Optional delay for better UX
    } else {
      setError('Invalid verification code. Please try again.');
      setSuccess(false);
    }
  };

  // Simulate resending the verification code
  const handleResendCode = () => {
    setError('');
    setCountdown(30); // Reset countdown
    setResendDisabled(true); // Disable resend button again
    console.log('Verification code resent!');
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
        <Typography variant="h5" align="center" gutterBottom>
          Verify Your Email
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 3, mt: 2 }}>
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
            {/* Redirecting... */}
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
              onFocus={(e) => e.target.select()} // Select text on focus
              inputRef={(el) => (inputRefs.current[index] = el)} // Assign ref
              sx={{
                width: '58px',
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
            fontWeight:'bold',
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