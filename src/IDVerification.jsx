import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Import Cloud Upload Icon
import AccountCircle from '@mui/icons-material/AccountCircle'; // Import AccountCircle Icon

const IDVerification = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const email = location.state?.email; // Get email from state
  const [tinNumber, setTinNumber] = useState('');
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle front image upload
  const handleFrontImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/') && validateImageDimensions(file)) {
      setFrontImage(file);
    } else {
      setError(
        'Please upload a valid image file (PNG or JPG) with dimensions up to 800x400px.'
      );
    }
  };

  // Handle back image upload
  const handleBackImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/') && validateImageDimensions(file)) {
      setBackImage(file);
    } else {
      setError(
        'Please upload a valid image file (PNG or JPG) with dimensions up to 800x400px.'
      );
    }
  };

  // Validate image dimensions
  const validateImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        resolve(img.width <= 800 && img.height <= 400);
      };
    });
  };

  // Handle form submission
  const handleSubmit = () => {
 

    setError('');

    // Validate inputs
    if (!tinNumber.trim()) {
      setError('Please enter your Ghana card number.');
      return;
    }
    if (!frontImage || !backImage) {
      setError('Please upload both front and back images of your ID.');
      return;
    }

    // Simulate backend API call
    console.log('Submitting ID verification:', { email, tinNumber, frontImage, backImage });

    // Redirect to the Details Approved page
    navigate('/details-approved'); // Use navigate to redirect
    setSuccess(true);

    
  };

  return (
    <Box
      className="page_container"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh', // Full viewport height
        justifyContent: 'space-evenly',
        alignItems: 'center',
        bgcolor: '#f9f9f9',
        // overflowY: 'auto',
        '-ms-overflow-style': 'none',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        padding: '1rem',
        // paddingTop: '3rem',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          padding: '0.5rem',
        }}
      >
        <h2 style={{ marginBottom: '2rem' }}>Verify your ID</h2>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Success Message */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Verifying.....
          </Alert>
        )}

        {/* TIN Number Field */}
        <TextField
          label="ID Number"
          type="text"
          variant="outlined"
          fullWidth
          required
          placeholder="GHA-720004-6"
          value={tinNumber}
          onChange={(e) => setTinNumber(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
        />

        {/* Front Image Upload */}
        <Typography variant="subtitle3" sx={{ mb: 1, fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.41)' }}>
          Upload front view of your ID
        </Typography>
        <Box
          sx={{
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            padding: '1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            mb: 3,
            transition: 'box-shadow 0.3s ease',
            ...(frontImage && {
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            }),
            '&:hover': {
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <input
            type="file"
            accept="image/png, image/jpeg"
            hidden
            onChange={handleFrontImageChange}
            id="front-image-upload"
          />
          <label htmlFor="front-image-upload">
            {!frontImage ? (
              <>
                <IconButton
                  color="primary"
                  sx={{
                    bgcolor: '#f0f0f0',
                    '&:hover': { bgcolor: '#e0e0e0' },
                    mb: 1,
                  }}
                >
                  <CloudUploadIcon fontSize="large" />
                </IconButton>
                <Typography variant="subtitle3" sx={{ color: 'rgba(0, 0, 0, 0.96)', fontWeight: 'bold' }}>
                  <br /> Click to upload
                  <span style={{ fontWeight: '500', color: 'rgba(0, 0, 0, 0.41)' }}>
                    <br /> SVG, PNG, JPG (max 800x400px)
                  </span>
                </Typography>
              </>
            ) : (
              <p variant="subtitle3" sx={{ color: '#000', fontWeight: '500' }}>
                {frontImage.name} uploaded
              </p>
            )}
          </label>
        </Box>

        {/* Back Image Upload */}
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.41)' }}>
          Upload back view of your ID
        </Typography>
        <Box
          sx={{
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            padding: '1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            mb: 3,
            transition: 'box-shadow 0.3s ease',
            ...(backImage && {
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            }),
            '&:hover': {
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <input
            type="file"
            accept="image/png, image/jpeg"
            hidden
            onChange={handleBackImageChange}
            id="back-image-upload"
          />
          <label htmlFor="back-image-upload">
            {!backImage ? (
              <>
                <IconButton
                  color="primary"
                  sx={{
                    bgcolor: '#f0f0f0',
                    '&:hover': { bgcolor: '#e0e0e0' },
                    mb: 1,
                  }}
                >
                  <CloudUploadIcon fontSize="large" />
                </IconButton>
                <Typography variant="subtitle3" sx={{ color: 'rgba(0, 0, 0, 0.96)', fontWeight: 'bold' }}>
                  <br /> Click to upload
                  <span style={{ fontWeight: '500', color: 'rgba(0, 0, 0, 0.41)' }}>
                    <br /> SVG, PNG, JPG (max 800x400px)
                  </span>
                </Typography>
              </>
            ) : (
              <Typography variant="subtitle3" sx={{ fontWeight: '500', color: '#000' }}>
                {backImage.name} uploaded
              </Typography>
            )}
          </label>
        </Box>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          size="large"
          disabled={success}
          sx={{
            fontWeight: 'bold',
            textTransform: 'none',
            // margin: '1rem',
            backgroundColor: '#000',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default IDVerification;