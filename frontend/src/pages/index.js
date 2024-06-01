import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [currencyDate, setCurrencyDate] = useState("");
  const [currencyDetails, setCurrencyDetails] = useState({});
  const [isShow, setIsShow] = useState(false);
  const [getCurrencyValueTo, setGetCurrencyValueTo] = useState(0)

  useEffect(() => {
    if (selectedCurrency) {
      axios.get(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${selectedCurrency}.json`)
        .then((res) => {
          console.log(res.data);
          setCurrencyDate(res.data.date || "Date not available");
          setCurrencyDetails(res.data[selectedCurrency] || {});
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
    <main className="min-h-screen flex flex-col items-center bg-slate-50 font-sans">
      <div className="bg-gray-300 rounded-sm p-2 flex mb-2 w-full font-sans">
        Welcome to Currency Exchange
      </div>
      <button 
        onClick={handleClick} 
        className="hover:bg-black hover:text-white ml-4 p-2 border bg-white border-gray-300 rounded">
        From Currencies
      </button>

      {isShow && (
        <section className="mt-4">
          {currencies.map(([key, value]) => (
            <button 
              onClick={() => {
                setSelectedCurrency(key);
                console.log(selectedCurrency);
                setIsShow(false);
              }} 
              key={key} 
              className="block hover:bg-slate-400 rounded-md p-2">
              {key}: {value}
            </button>
          ))}
        </section>
      )}

      {!isShow && selectedCurrency && (
        <section className="mt-4">
          <h2>Details for {selectedCurrency}</h2>
          <p>Date: {currencyDate}</p>
          <div>
            {Object.entries(currencyDetails).map(([key, value]) => (
              <button 
                key={key}
                onClick={() =>{
                  setGetCurrencyValueTo(value)
                  console.log(getCurrencyValueTo)
                }}
                className="block hover:bg-slate-400 rounded-md p-2">
                {key}: {value}
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
