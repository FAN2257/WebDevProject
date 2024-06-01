import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [currencyDetails, setCurrencyDetails] = useState(null);
  const [isShow, setIsShow] = useState(false);
  
  useEffect(() => {
    if (selectedCurrency) {
      axios.get(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${selectedCurrency}.json`)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [selectedCurrency]);

  const handleClick = async () => {
    try {
      const res = await axios.get('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json');
      console.log(res.data);
      setCurrencies(Object.entries(res.data));
      setIsShow(!isShow);
    } catch (err) {
      console.error(err);
    } finally {
      console.log('axios request finished');
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-slate-50 font-sans">
      <div>Welcome to Currency Exchange</div>
      <button 
        onClick={handleClick} 
        className="hover:bg-black hover:text-white ml-4 p-2 border bg-white border-gray-300 rounded">
        Click Me
      </button>

      {isShow && (
        <section className="mt-4">
          {currencies.map(([key, value]) => (
            <button 
              onClick={() => {
                setSelectedCurrency(key);
              }} 
              key={key} 
              className="block hover:bg-slate-400 rounded-md p-2">
              {key}: {value}
            </button>
          ))}
        </section>
      )}

      {/* {isShow && currencyDetails && (
        <section className="mt-4">
          <h2>Details for {selectedCurrency}</h2>
          <pre>{JSON.stringify(currencyDetails, null, 2)}</pre>
        </section>
      )} */}
    </main>
  );
}
