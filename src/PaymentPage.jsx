import { useState, useMemo } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { PaystackButton } from 'react-paystack';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ghsAmount, currency } = location.state || {};
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);
  const publicKey = "pk_test_30ed210458796159b9e71cc36040a0894c2c2d62";


  // Validate phone number
  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[0-9]{10}$/; // Basic validation for 10-
    return phoneRegex.test(number);
  };

  const componentProps = useMemo(() => {
    return {
      // email,
      amount,
      metadata: {
        crypto: currency,
        cryptoAmount: '0.00369700', // Example crypto amount
        phone: phoneNumber,
      },
      publicKey,
      text: 'Proceed to Payment',
      onSuccess: (response) => {
        alert(`Payment successful! Ref: ${response.reference}`);
        navigate('/homepage');
      },
      onClose: () => alert('Payment window closed.'),
    };
  }, [ amount, phoneNumber, currency, publicKey]);


  // Paystack configuration
//   const paystackConfig = useMemo(() => {
//     return {
//       reference: `SHEERAH-${new Date().getTime()}`, 
//       email: `${phoneNumber}@gmail.com`, 
//       phone: phoneNumber, 
//       amount: parseFloat(ghsAmount) * 100 || 0, 
//       currency: 'GHS',
//       key: 'pk_test_30ed210458796159b9e71cc36040a0894c2c2d62',
//       metadata: JSON.stringify({ crypto: currency, cryptoAmount: '0.00369700' }), 
//     };
//   }, [phoneNumber, ghsAmount, currency]);

  // Handle Paystack success
  const handleSuccess = (response) => {
    alert(`Payment successful! Ref: ${response.reference}`);
    navigate('/homepage');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Complete Your Payment
      </Typography>

      {/* Error Message */}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Phone Number Input Field */}
      <TextField
        label="Phone Number"
        type="tel"
        fullWidth
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        sx={{ mb: 3, maxWidth: '400px' }}
        required
      />

      {/* Paystack Button */}
      <PaystackButton
        text="Proceed to Payment"
        className="paystack-button"
        onSuccess={handleSuccess}
        onClose={() => alert('Payment window closed.')}
        {...componentProps} 
        // config={componentProps}
        disabled={!validatePhoneNumber(phoneNumber)} // Disable if phone number is invalid
        sx={{
          bgcolor: 'blue',
          color: 'white',
          '&:hover': { bgcolor: '#0056b3' },
        }}
      />

      {/* Back Button */}
      <Button
        variant="text"
        onClick={() => navigate(-1)}
        sx={{ mt: 3, color: 'blue' }}
      >
        Go Back
      </Button>
    </Box>
  );
};

export default PaymentPage;