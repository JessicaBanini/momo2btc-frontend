// Login.jsx
import { useState } from 'react';
import { Card, CardContent, TextField, Button } from '@mui/material';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your actual login logic here
    onLogin(); // This sets the logged-in state
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <Card className="w-96 shadow-xl">
        <CardContent className="flex flex-col gap-4 p-6">
          <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <TextField 
              label="Email" 
              type="email" 
              variant="outlined" 
              fullWidth 
              sx={{ mb: 2 }}
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
            <TextField 
              label="Password" 
              type="password" 
              variant="outlined" 
              fullWidth 
              sx={{ mb: 3 }}
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            <Button 
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                backgroundColor: "#000", // Black background
                color: "#fff", // White text
                "&:hover": {
                  backgroundColor: "#333", // Darker shade on hover
                },
              }}
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;