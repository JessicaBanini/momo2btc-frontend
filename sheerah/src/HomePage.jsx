import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Tabs, Tab, TextField, Select, MenuItem, InputAdornment, Alert } from '@mui/material';
import axios from 'axios';

const HomePage = () => {
  const [value, setValue] = useState(0); // Active tab
  const [currency, setCurrency] = useState('BTC'); // Selected cryptocurrency
  const [ghsAmount, setGhsAmount] = useState(''); // GHS input
  const [exchangeRates, setExchangeRates] = useState({}); // Converted GHS rates
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(true); // Loading state

  // Mapping from ticker symbols to Coingecko API IDs
  const CURRENCY_ID_MAP = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    USDT: 'tether',
    LTC: 'litecoin',
    XRP: 'ripple',
    ADA: 'cardano',
    SOL: 'solana',
  };

  // Stablecoins for decimal formatting
  const STABLECOINS = ['USDT'];

  // Fetch exchange rates (USD → GHS + Crypto USD Prices)
  const fetchExchangeRates = async () => {
    try {
      // 1. Fetch real-time USD/GHS rate
      const usdGhsResponse = await axios.get(
        'https://v6.exchangerate-api.com/v6/d2d701c69f46320aa5541250/latest/USD'
      );
      const usdToGhsRate = usdGhsResponse.data.conversion_rates.GHS;

      // 2. Fetch crypto prices in USD
      const cryptoResponse = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: Object.values(CURRENCY_ID_MAP).join(','),
            vs_currencies: 'usd',
          },
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-QCfvYJ9H2S3aak9BPFBJ6mF5', // Your Coingecko API key
          },
        }
      );
      const usdRates = cryptoResponse.data;

      // 3. Convert crypto USD rates to GHS
      const convertedRates = Object.keys(usdRates).reduce((acc, crypto) => {
        acc[crypto] = { ghs: usdRates[crypto].usd * usdToGhsRate };
        return acc;
      }, {});

      setExchangeRates(convertedRates);
    } catch (err) {
      console.error('Error fetching exchange rates:', err);
      setError('Failed to fetch real-time rates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate crypto amount
  const cryptoAmount = useMemo(() => {
    const apiId = CURRENCY_ID_MAP[currency];
    if (!ghsAmount || !apiId || !exchangeRates[apiId]?.ghs) return '0.00';

    const rate = exchangeRates[apiId].ghs;
    const decimals = STABLECOINS.includes(currency) ? 2 : 8;
    return (parseFloat(ghsAmount) / rate).toFixed(decimals);
  }, [ghsAmount, currency, exchangeRates]);

  // Fetch data on mount
  useEffect(() => {
    fetchExchangeRates();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        padding: '1rem',
        bgcolor: '#f9f9f9',
        paddingTop: '2rem',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY: 'auto',
        '-ms-overflow-style': 'none',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {/* Header */}
      <Typography variant="h4" align="center" sx={{ color: '#333', fontWeight: 'bold', mb: 3 }}>
        Sheerah<span style={{ color: 'blue' }}>Trade</span>
      </Typography>

      {/* Tabs */}
      <Tabs
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        centered
        sx={{
          mb: 3,
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 'bold' },
          '& .MuiTabs-indicator': { bgcolor: 'blue' },
        }}
      >
        <Tab label="Buy" />
        <Tab label="Sell" />
        <Tab label="Transaction History" />
      </Tabs>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, width: '100%', maxWidth: '500px' }}>
          {error}
        </Alert>
      )}

      {/* Tab Content */}
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '500px',
        }}
      >
        {value === 0 && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 3 }}>
              Buy Cryptocurrency
            </Typography>

            {loading ? (
              <Typography>Loading exchange rates...</Typography>
            ) : (
              <>
                {/* GHS Input Field */}
                <TextField
                  label="GHS Amount"
                  type="number"
                  fullWidth
                  value={ghsAmount}
                  onChange={(e) => {
                    const amount = e.target.value;
                    if (isNaN(amount) || amount < 0) {
                      setError('Please enter a valid positive number.');
                      return;
                    }
                    setError(null);
                    setGhsAmount(amount);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <img
                          src="https://img.icons8.com/color/48/ghana.png"
                          alt="Ghana Flag"
                          style={{ width: '20px', marginRight: '8px' }}
                        />
                        GHS
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3, '& .MuiInputBase-input': { textAlign: 'right' } }}
                  inputProps={{ min: 0 }}
                />

                {/* Crypto Input Field */}
                <TextField
                  label="Receive"
                  fullWidth
                  value={cryptoAmount}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          sx={{
                            minWidth: '120px',
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '& .MuiSelect-icon': { display: 'none' },
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: { border: 'none', boxShadow: 'none', mt: 1 },
                            },
                          }}
                        >
                          {/* Cryptocurrencies */}
                          <MenuItem value="BTC">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src="https://img.icons8.com/color/48/bitcoin.png"
                                alt="BTC"
                                style={{ width: '20px', marginRight: '8px' }}
                              />
                              BTC
                            </Box>
                          </MenuItem>
                          <MenuItem value="ETH">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src="https://img.icons8.com/color/48/ethereum.png"
                                alt="ETH"
                                style={{ width: '20px', marginRight: '8px' }}
                              />
                              ETH
                            </Box>
                          </MenuItem>
                          <MenuItem value="USDT">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src="https://img.icons8.com/?size=100&id=U8V97McJaXmr&format=png&color=000000"
                                alt="USDT"
                                style={{ width: '20px', marginRight: '8px' }}
                              />
                              USDT
                            </Box>
                          </MenuItem>
                          <MenuItem value="LTC">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src="https://img.icons8.com/?size=100&id=4ASuE77zHw4s&format=png&color=000000"
                                alt="LTC"
                                style={{ width: '20px', marginRight: '8px' }}
                              />
                              LTC
                            </Box>
                          </MenuItem>
                          <MenuItem value="XRP">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src="https://img.icons8.com/?size=100&id=OSofAdTFAZ8L&format=png&color=000000"
                                alt="XRP"
                                style={{ width: '20px', marginRight: '8px' }}
                              />
                              XRP
                            </Box>
                          </MenuItem>
                          <MenuItem value="ADA">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src="https://img.icons8.com/?size=100&id=xnZMZXqLEDk1&format=png&color=000000"
                                alt="ADA"
                                style={{ width: '20px', marginRight: '8px' }}
                              />
                              ADA
                            </Box>
                          </MenuItem>
                          <MenuItem value="SOL">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src="https://img.icons8.com/?size=100&id=icTiMgoOHSVy&format=png&color=000000"
                                alt="SOL"
                                style={{ width: '20px', marginRight: '8px' }}
                              />
                              SOL
                            </Box>
                          </MenuItem>
                        </Select>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiInputBase-input': { textAlign: 'right' } }}
                />
              </>
            )}
          </>
        )}

        {value === 1 && <Typography>Sell functionality coming soon...</Typography>}
        {value === 2 && <Typography>Transaction history will appear here</Typography>}
      </Box>
    </Box>
  );
};

export default HomePage;