import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Loading from './Loading';
import Login from './Login';
import CreateAccount from './CreateAccount';
import PaymentPage from './PaymentPage';
import VerifyEmail from './VerifyEmail'; // OTP verification page
import IDVerification from './IDVerification'; // ID verification page
import DetailsApproved from './DetailsApproved'; // Details Approved page
import HomePage from './HomePage'; // Homepage with tabs
import './App.css';

export default function App() {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Check if user has previously logged in
    const hasLoggedIn = localStorage.getItem('hasLoggedIn');
    if (hasLoggedIn) {
      setShowLogin(true);
    }
  }, []);

  return (
    
    <Router>
      <AnimatePresence mode="wait">
        {!showLogin ? (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Loading onComplete={() => setShowLogin(true)} />
          </motion.div>
        ) : (
          <Routes>
            {/* Login Page */}
            <Route
              path="/"
              element={
                <motion.div
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Login/>
                </motion.div>
              }
            />

            {/* Create Account Page */}
            <Route
              path="/create-account"
              element={
                <motion.div
                  key="create-account"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <CreateAccount />
                </motion.div>
              }
            />

            {/* OTP Verification Page */}
            <Route
              path="/verify-email"
              element={
                <motion.div
                  key="verify-email"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <VerifyEmail />
                </motion.div>
              }
            />

            {/* ID Verification Page */}
            <Route
              path="/id-verification"
              element={
                <motion.div
                  key="id-verification"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <IDVerification />
                </motion.div>
              }
            />

            {/* Details Approved Page */}
            <Route
              path="/details-approved"
              element={
                <motion.div
                  key="details-approved"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <DetailsApproved />
                </motion.div>
              }
            />

            {/* Homepage */}
            <Route
              path="/homepage"
              element={
                <motion.div
                  key="homepage"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <HomePage />
                </motion.div>
              }
            />
            {/* Homepage */}
            <Route
              path="/payment"
              element={
                <motion.div
                  key="payment"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <PaymentPage />
                </motion.div>
              }
            />
          </Routes>
        )}
      </AnimatePresence>
    </Router>
  );
}