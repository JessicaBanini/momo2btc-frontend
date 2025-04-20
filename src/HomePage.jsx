import { useState, useEffect, useMemo } from 'react';
import { Box, Typography,  TextField, Select, MenuItem, InputAdornment, Alert, Button, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// 

import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';

import { PaystackButton } from 'react-paystack'; // Import PaystackButton


const HomePage = () => {
  const [value, setValue] = useState(0);
  const [currency, setCurrency] = useState('BTC');
  const [ghsAmount, setGhsAmount] = useState('');
  const [exchangeRates, setExchangeRates] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sellCryptoAmount, setSellCryptoAmount] = useState('');
  const [sellGhsAmount, setSellGhsAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  // const publicKey = "pk_test_30ed210458796159b9e71cc36040a0894c2c2d62";
  // const [ email, setEmail ] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");
  // const [showPhoneField, setShowPhoneField] = useState(false); 




  // const validatePhoneNumber = (number) => {
  //   const phoneRegex = /^[0-9]{10,15}$/; // Validate 10-15 digits
  //   return phoneRegex.test(number);
  // };
 

  const CURRENCY_ID_MAP = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    USDT: 'tether',
    LTC: 'litecoin',
    XRP: 'ripple',
    ADA: 'cardano',
    SOL: 'solana',
  };

  const STABLECOINS = ['USDT'];

  // Fetch exchange rates (USD → GHS + Crypto USD Prices)
  const fetchExchangeRates = async () => {
    try {
      const usdGhsResponse = await axios.get('https://v6.exchangerate-api.com/v6/d2d701c69f46320aa5541250/latest/USD');
      const usdToGhsRate = usdGhsResponse.data.conversion_rates.GHS;

      const cryptoResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: { ids: Object.values(CURRENCY_ID_MAP).join(','), vs_currencies: 'usd' },
        headers: { 'x-cg-demo-api-key': 'CG-QCfvYJ9H2S3aak9BPFBJ6mF5' },
      });
      const usdRates = cryptoResponse.data;

      const convertedRates = Object.keys(usdRates).reduce((acc, crypto) => {
        acc[crypto] = { ghs: usdRates[crypto].usd * usdToGhsRate };
        return acc;
      }, {});

      setExchangeRates(convertedRates);
    } catch (err) {
      setError('Failed to fetch rates. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const cryptoAmount = useMemo(() => {
    const apiId = CURRENCY_ID_MAP[currency];
    if (!ghsAmount || !apiId || !exchangeRates[apiId]?.ghs) return '0.00';
    const rate = exchangeRates[apiId].ghs;
    const decimals = STABLECOINS.includes(currency) ? 2 : 8;
    return (parseFloat(ghsAmount) / rate).toFixed(decimals);
  }, [ghsAmount, currency, exchangeRates]);

  // Sell Tab Logic
  const handleSellCryptoChange = (e) => {
    const amount = e.target.value;
    if (isNaN(amount) || amount < 0) {
      setError('Please enter a valid positive number.');
      return;
    }
    setError(null);
    setSellCryptoAmount(amount);
    const apiId = CURRENCY_ID_MAP[currency];
    if (apiId && exchangeRates[apiId]?.ghs) {
      const rate = exchangeRates[apiId].ghs;
      setSellGhsAmount((parseFloat(amount) * rate).toFixed(2));
    }
  };

  // Simulate Transaction
 
  // const paystackConfig = useMemo(() => {
  //   const metadata = {
  //     crypto: currency,
  //     cryptoAmount: cryptoAmount,
  //     user: email, 
  //   };
  //   return {
  //     reference: `SHEERAH-${new Date().getTime()}`, // Unique transaction reference
  //     email: email, // 
  //     amount: parseFloat(ghsAmount) * 100 || 0, // Convert GHS to pesewas
  //     currency: 'GHS',
  //     publicKey: 'pk_test_30ed210458796159b9e71cc36040a0894c2c2d62',
  //     metadata: JSON.stringify(metadata),
  //   };
  // }, [currency, ghsAmount, cryptoAmount]);


  const handleBuyNow = () => {
    if (!ghsAmount || !currency) {
      setError('Please enter a valid GHS amount and select a cryptocurrency.');
      return;
    }
    navigate('/payment', {
      state: {
        ghsAmount,
        currency,
      },
    });
  };


  return (
    

    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100dvh', padding: '1rem', bgcolor: '#f9f9f9', paddingTop: '0rem', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', mb: 3 }}>
        Sheerah<span style={{ color: 'blue' }}>Trade</span>
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 3, width: '100%', maxWidth: '500px' }}>
          {error}
        </Alert>
      )}
      <Tabs
        value={value}
        variant="outlined"
        onChange={(_, newValue) => setValue(newValue)}
        aria-label="Cryptocurrency Actions"
        defaultValue={0}
        sx={{
          width: '100%',
          maxWidth: '500px',
          borderRadius: 'lg',
          boxShadow: 'sm',
          overflow: 'auto',
          minHeight:'50dvh'
        }}
      >
       <TabList
          disableUnderline
          tabFlex={1}
          sx={{
            [`& .${tabClasses.root}`]: {
              fontSize: '0.9rem',
              fontWeight: '700',
              [`&[aria-selected="true"]`]: {
                color: 'black',
                bgcolor: 'background.surface',
                minHeight:'3rem'
              },
              [`&.${Tab.focusVisible}`]: {
                outlineOffset: '-4px',
              },
            },
          }}
          >
          <Tab disableIndicator variant="soft" sx={{ flexGrow: 1 }}>
            Buy
          </Tab>
          <Tab disableIndicator variant="soft" sx={{ flexGrow: 1 }}>
            Sell
          </Tab>
          <Tab disableIndicator variant="soft" sx={{ flexGrow: 1 }}>
            Transactions
          </Tab>
        </TabList>

        <TabPanel value={0}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 3,}}>
            Buy Crypto
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
                  if (isNaN(amount) || amount < 0) setError('Invalid GHS amount');
                  else { setError(null); setGhsAmount(amount); }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        src="https://img.icons8.com/color/48/ghana.png"
                        alt="Ghana Flag"
                        style={{ width: '24px', marginRight: '8px' }}
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
                          '& .MuiSelect-icon': { display: 'none'},
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: { border: 'none', boxShadow: 'none', mt: 1 },
                          },
                        }}
                        IconComponent={KeyboardArrowDownIcon} // Add down arrow icon
                      >
                        {/* Cryptocurrencies */}
                        <MenuItem value="BTC">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <img
                              src="https://img.icons8.com/color/48/bitcoin.png"
                              alt="Bitcoin"
                              style={{ width: '25px', marginRight: '8px' , marginLeft: '-11px'}}
                            />
                            BTC
                          </Box>
                        </MenuItem>
                        <MenuItem value="ETH">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <img
                              src="https://img.icons8.com/color/48/ethereum.png"
                              alt="Ethereum"
                              style={{ width: '25px', marginRight: '8px' , marginLeft: '-11px'}}
                            />
                            ETH
                          </Box>
                        </MenuItem>
                        <MenuItem value="USDT">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <img
                              src="https://img.icons8.com/?size=100&id=U8V97McJaXmr&format=png&color=000000"
                              alt="USDT"
                              style={{ width: '25px', marginRight: '8px' , marginLeft: '-11px'}}
                          />
                          USDT
                        </Box>
                       </MenuItem>
                       <MenuItem value="LTC">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <img
                              src="https://img.icons8.com/?size=100&id=4ASuE77zHw4s&format=png&color=000000"
                              alt="LTC"
                              style={{ width: '25px', marginRight: '8px' , marginLeft: '-11px'}}
                          />
                          LTC
                        </Box>
                      </MenuItem>
                      <MenuItem value="XRP">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src="https://img.icons8.com/?size=100&id=OSofAdTFAZ8L&format=png&color=000000"
                            alt="XRP"
                            style={{ width: '25px', marginRight: '8px' , marginLeft: '-11px'}}
                            />
                        XRP
                      </Box>
                      </MenuItem>
                      <MenuItem value="ADA">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src="https://img.icons8.com/?size=100&id=xnZMZXqLEDk1&format=png&color=000000"
                            alt="ADA"
                            style={{ width: '25px', marginRight: '8px' , marginLeft: '-11px'}}
                            />
                        ADA
                      </Box>
                      </MenuItem>
                      <MenuItem value="SOL">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src="https://img.icons8.com/?size=100&id=icTiMgoOHSVy&format=png&color=000000"
                            alt="SOL"
                            style={{ width: '25px', marginRight: '8px' , marginLeft: '-11px'}}
                            />
                        SOL
                      </Box>
                      </MenuItem>
                      </Select>
                    </InputAdornment>
                  ),
                }}
                sx={{'& .MuiInputBase-input': { textAlign: 'right' }, mb: 3 }}
              />

                {ghsAmount > 0 && (             
                <Typography  sx={{ mt: 3, color: 'text.secondary', mb: 2 , textAlign:'center' ,fontSize:'0.75rem'}}>
                  0.5% transaction fee will be applied
                </Typography>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  disabled={!ghsAmount || !currency || loading}
                  onClick={() => alert('Payment initiated')}
                  sx={{
                    mb: 2,
                    bgcolor: 'black',
                    textTransform: 'none',
                    color: 'white',
                    '&:hover': { bgcolor: '#0056b3' },
                  }}
                >
                  Buy Now
                </Button>
            </>
          )}
        </TabPanel>

        {/* Other tabs */}
        <TabPanel value={1}>

        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 3 }}>Sell Crypto</Typography>
            {loading ? <Typography variant='success'>Loading rates...</Typography> : (
              <>
                <TextField
                  label="Crypto Amount"
                  type="number"
                  fullWidth
                  value={sellCryptoAmount}
                  onChange={handleSellCryptoChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          sx={{ minWidth: '120px', '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '& .MuiSelect-icon': { display: 'none' } }}
                          MenuProps={{ PaperProps: { sx: { border: 'none', boxShadow: 'none', mt: 1 } } }}
                        >
                          <MenuItem value="BTC">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <img
                              src="https://img.icons8.com/color/48/bitcoin.png"
                              alt="Bitcoin"
                              style={{ width: '25px', marginRight: '8px' , marginLeft: '-11px'}}
                            />
                            BTC
                          </Box>
                        </MenuItem>
                        <MenuItem value="ETH">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <img
                              src="https://img.icons8.com/color/48/ethereum.png"
                              alt="Ethereum"
                              style={{ width: '25px', marginRight: '8px' , marginLeft: '-11px'}}
                            />
                            ETH
                          </Box>
                        </MenuItem>
                        <MenuItem value="USDT">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <img
                              src="https://img.icons8.com/?size=100&id=U8V97McJaXmr&format=png&color=000000"
                              alt="USDT"
                              style={{ width: '25px', marginRight: '8px' , marginLeft: '-11px'}}
                          />
                          USDT
                        </Box>
                       </MenuItem>
                       <MenuItem value="LTC">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <img
                              src="https://img.icons8.com/?size=100&id=4ASuE77zHw4s&format=png&color=000000"
                              alt="LTC"
                              style={{ width: '25px', marginRight: '8px' , marginLeft: '-11px'}}
                          />
                          LTC
                        </Box>
                      </MenuItem>
                      <MenuItem value="XRP">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src="https://img.icons8.com/?size=100&id=OSofAdTFAZ8L&format=png&color=000000"
                            alt="XRP"
                            style={{ width: '25px', marginRight: '8px' , marginLeft: '-11px'}}
                            />
                        XRP
                      </Box>
                      </MenuItem>
                      <MenuItem value="ADA">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src="https://img.icons8.com/?size=100&id=xnZMZXqLEDk1&format=png&color=000000"
                            alt="ADA"
                            style={{ width: '25px', marginRight: '8px' , marginLeft: '-11px'}}
                            />
                        ADA
                      </Box>
                      </MenuItem>
                      <MenuItem value="SOL">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src="https://img.icons8.com/?size=100&id=icTiMgoOHSVy&format=png&color=000000"
                            alt="SOL"
                            style={{ width: '25px', marginRight: '8px' , marginLeft: '-11px'}}
                            />
                        SOL
                      </Box>
                      </MenuItem>
                        </Select>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3, '& .MuiInputBase-input': { textAlign: 'right' } }}
                  inputProps={{ min: 0 }}
                />
                <TextField
                  label="Withdraw"
                  fullWidth
                  value={sellGhsAmount}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <img src="https://img.icons8.com/color/48/ghana.png" style={{ width: '24px', marginRight: '8px' }} alt="Ghana Flag" />
                        GHS
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiInputBase-input': { textAlign: 'right', } , mb: 3}}

                  
                />
                {sellCryptoAmount > 0 && (             
                <Typography  sx={{ mt: 3, color: 'text.secondary', mb: 2 , textAlign:'center' ,fontSize:'0.75rem'}}>
                  0.5% transaction fee will be applied
                </Typography>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  disabled={!sellCryptoAmount || !currency || loading}
                  onClick={() => alert('Payment initiated')}
                  sx={{
                    // mt: 3,
                    mb: 2,
                    bgcolor: 'black',
                    textTransform: 'none',
                    color: 'white',
                    '&:hover': { bgcolor: '#0056b3' },
                  }}
                >
                  Withdraw
                </Button>
              </>
            )}


        </TabPanel>
        <TabPanel value={2}>

        <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {/* <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 3 }}>Transaction History</Typography> */}
            {transactions.length === 0 ? (
              <Typography  sx={{ mt: 11, color: 'text.secondary', mb: 2 , textAlign:'center'}}>No transactions yet</Typography>
            ) : (
              <List>
                {transactions.map((tx) => (
                  <ListItem key={tx.id} sx={{ bgcolor: '#f0f0f0', mb: 1, borderRadius: '8px' }}>
                    <ListItemText
                      primary={`${tx.type} ${tx.amount} ${tx.crypto}`}
                      secondary={`GHS ${tx.ghs} • ${tx.timestamp}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>


        </TabPanel>

        




       </Tabs>








      {/* <Tabs value={value} onChange={(_, newValue) => setValue(newValue)} centered sx={{ mb: 3 , '& .MuiTab-root': { textTransform: 'none', fontWeight: 'bold' }, '& .MuiTabs-indicator': { bgcolor: 'blue' } }}>
        <Tab label="Buy" />
        <Tab label="Sell" />
        <Tab label="Transaction History" />
      </Tabs>
      {error && <Alert severity="error" sx={{ mb: 3, width: '100%', maxWidth: '500px' }}>{error}</Alert>}
      <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' }}> */}

{/* {value === 0 && (
  <>
    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 3 }}>
      Buy Cryptocurrency
    </Typography>
    {loading ? (
      <Typography>Loading exchange rates...</Typography>
    ) : ( */}
      <>
        {/* GHS Input Field */}
        {/* <TextField
          label="GHS Amount"
          type="number"
          fullWidth
          value={ghsAmount}
          onChange={(e) => {
            const amount = e.target.value;
            if (isNaN(amount) || amount < 0) setError('Invalid GHS amount');
            else { setError(null); setGhsAmount(amount); }
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
        /> */}
        {/* Crypto Input Field */}
        {/* <TextField
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
                  MenuProps={{ PaperProps: { sx: { border: 'none', boxShadow: 'none', mt: 1 } } }}
                > */}
                  {/* Valid Crypto Icons */}
                  {/* <MenuItem value="BTC">
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
                        style={{ width: '25px', marginRight: '8px' }}
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
          sx={{ '& .MuiInputBase-input': { textAlign: 'right' }, mb: 2 }}
        /> */}


      {/* <Button
        variant="contained"
        onClick={handleBuyNow}
        fullWidth
        sx={{ bgcolor: 'blue', color: 'white', '&:hover': { bgcolor: '#0056b3' } }}
      >
        Buy Now
      </Button> */}







    

         

       </>
    {/* )} */}
  {/* </> */}
{/* )} */}
        {/* {value === 1 && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 3 }}>Sell Cryptocurrency</Typography>
            {loading ? <Typography>Loading rates...</Typography> : (
              <>
                <TextField
                  label="Crypto Amount"
                  type="number"
                  fullWidth
                  value={sellCryptoAmount}
                  onChange={handleSellCryptoChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          sx={{ minWidth: '120px', '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '& .MuiSelect-icon': { display: 'none' } }}
                          MenuProps={{ PaperProps: { sx: { border: 'none', boxShadow: 'none', mt: 1 } } }}
                        >
                          {Object.entries(CURRENCY_ID_MAP).map(([ticker, id]) => (
                            <MenuItem key={id} value={ticker}>
                              <img src={`https://img.icons8.com/color/48/${id}.png`} style={{ width: '20px', marginRight: '8px' }} alt={ticker} />
                              {ticker}
                            </MenuItem>
                          ))}
                        </Select>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3, '& .MuiInputBase-input': { textAlign: 'right' } }}
                  inputProps={{ min: 0 }}
                />
                <TextField
                  label="GHS Equivalent"
                  fullWidth
                  value={sellGhsAmount}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <img src="https://img.icons8.com/color/48/ghana.png" style={{ width: '20px', marginRight: '8px' }} alt="Ghana Flag" />
                        GHS
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiInputBase-input': { textAlign: 'right' } }}
                />
              </>
            )}
          </>
        )}
        {value === 2 && (
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 3 }}>Transaction History</Typography>
            {transactions.length === 0 ? (
              <Typography>No transactions yet</Typography>
            ) : (
              <List>
                {transactions.map((tx) => (
                  <ListItem key={tx.id} sx={{ bgcolor: '#f0f0f0', mb: 1, borderRadius: '8px' }}>
                    <ListItemText
                      primary={`${tx.type} ${tx.amount} ${tx.crypto}`}
                      secondary={`GHS ${tx.ghs} • ${tx.timestamp}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
      </Box> */}
    </Box>

  );
};


export default HomePage;