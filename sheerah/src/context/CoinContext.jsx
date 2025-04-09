import { createContext, useEffect } from "react";

export const CoinContext = createContext();
const CoinContextProvider = (props)=>{


    const [allCoin, setAllCoin] = useState([]);
    const [currency, setCurrency] = useState({
        Name: 'ghs',
        symbol:'¢'
    });

    const fetchAllCoin = async ()=>{
        const options = {
            method: 'GET',
            headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-QCfvYJ9H2S3aak9BPFBJ6mF5'}
          };
          
          fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.Name}`, options)
            .then(res => res.json())
            .then(res => setAllCoin(res))
            .catch(err => console.error(err));

}

useEffect(() =>{
    fetchAllCoin();
},[currency])


    const contextValue={
        allCoin,currency,setCurrency
     
    }
    return (
        <CoinContext.Provider value={contextValue}>
            {props.children}
  
        </CoinContext.Provider>
        
    )
}
export default CoinContextProvider