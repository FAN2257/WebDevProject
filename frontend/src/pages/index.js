import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [currencyDate, setCurrencyDate] = useState("");
  const [currencyDetails, setCurrencyDetails] = useState({});
  const [isShowCurrencyFrom, setIsShow] = useState(false);
  const [isShowCurrencyTo, setIsShowCurrencyTo] = useState(false);
  const [getCurrencyValueTo, setGetCurrencyValueTo] = useState({ key: null, value: null });
  const [numberInput, setNumberInput] = useState(0);
  const [result, setResult] = useState(null);

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

  useEffect(() => {
    if (getCurrencyValueTo.value !== null) {
      console.log('getCurrencyValueTo updated:', getCurrencyValueTo);
    }
  }, [getCurrencyValueTo]);

  const handleClick = async () => {
    try {
      const res = await axios.get('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json');
      console.log(res.data);
      setCurrencies(Object.entries(res.data));
      setIsShow(!isShowCurrencyFrom);
      setSelectedCurrency("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCurrencyDetailsClick = (key, value) => {
    setGetCurrencyValueTo({ key, value });
    setIsShowCurrencyTo(false); 
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (getCurrencyValueTo.value !== null) {
      setResult(numberInput * getCurrencyValueTo.value);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-slate-50 font-sans">
      <div className="bg-gray-300 font-bold rounded-sm p-2 flex mb-2 w-full font-sans border-gray-400 border-b-2">
        <h1>Welcome to Currency Exchange</h1>
      </div>
      <button 
        onClick={handleClick} 
        className="hover:bg-black hover:text-white ml-4 p-2 border bg-white border-gray-300 rounded">
        From Currencies
      </button>

      {isShowCurrencyFrom && (
        <section className="mt-4">
          {currencies.map(([key, value]) => (
            <button 
              onClick={() => {
                setSelectedCurrency(key);
                console.log(selectedCurrency);
                setIsShow(false);
                setIsShowCurrencyTo(true);
              }} 
              key={key} 
              className="block hover:bg-slate-400 rounded-md p-2">
              {key}: {value}
              <hr className='border border-black'/>
            </button>
          ))}
        </section>
      )}

      {!isShowCurrencyFrom && isShowCurrencyTo && (
        <section className="mt-4">
          <h2>Details for {selectedCurrency}</h2>
          <p>Date: {currencyDate}</p>
          <hr className='border border-blue-300'/>
          <div>
            {Object.entries(currencyDetails).map(([key, value]) => (
              <button 
                key={key}
                onClick={() => handleCurrencyDetailsClick(key, value)}
                className="block hover:bg-slate-400 rounded-md p-2">
                {key}: {value}
                <hr className='border border-black'/>
              </button>
            ))}
          </div>
        </section>
      )}

      {!isShowCurrencyFrom && !isShowCurrencyTo && (
        <section className="mt-4">
          <h2>Type The Nominal</h2>
          <form onSubmit={handleFormSubmit}>
            <input 
              type="number" 
              min="0" 
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)} 
              className="border rounded p-2"
            />
            <button type="submit" className="hover:bg-black hover:text-white ml-4 p-2 border bg-white border-gray-300 rounded">
              Submit
            </button>
          </form>
          {result !== null && (
            <div className="mt-4">
              <h3>Value from {selectedCurrency} to {getCurrencyValueTo.key}: {result}</h3>
              <p>Date: {currencyDate}</p>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
