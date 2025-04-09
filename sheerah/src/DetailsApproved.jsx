import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Success icon

const DetailsApproved = () => {
  const navigate = useNavigate();

  // Simulate a delay before redirecting to the homepage
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/homepage'); // Redirect to the homepage after 3 seconds
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer); // Cleanup the timer
  }, [navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
        bgcolor: '#f9f9f9', // Light background
        textAlign: 'center',
        padding: '1rem', // Add padding for spacing
      }}
    >
      {/* Success Icon */}
      <IconButton
        sx={{
          color: '#4caf50', // Green color for success
          fontSize: '2.5rem', // Large icon size
          mb: 1, // Margin bottom
        }}
      >
        <CheckCircleIcon fontSize="inherit" />
      </IconButton>

      {/* Success Message */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Your details have been approved!
      </Typography>

      {/* Subtext */}
      {/* <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.6)', mb: 4 }}>
        Redirecting ...
      </Typography> */}
    </Box>
  );
};

export default DetailsApproved;