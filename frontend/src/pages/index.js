import { useState, useEffect } from 'react';
import axios from 'axios';
import { BsCurrencyExchange } from "react-icons/bs";

export default function Home() {
  const [start, setStart] = useState(true);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [currencyDate, setCurrencyDate] = useState("");
  const [currencyDetails, setCurrencyDetails] = useState({});
  const [isShowCurrencyFrom, setIsShowCurrencyFrom] = useState(true);
  const [isShowCurrencyTo, setIsShowCurrencyFromCurrencyTo] = useState(false);
  const [getCurrencyValueTo, setGetCurrencyValueTo] = useState({ key: null, value: null });
  const [numberInput, setNumberInput] = useState([]);
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
      setIsShowCurrencyFrom(true);
      setStart(false);
      setSelectedCurrency("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCurrencyDetailsClick = (key, value) => {
    setGetCurrencyValueTo({ key, value });
    setIsShowCurrencyFromCurrencyTo(false); 
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (getCurrencyValueTo.value !== null) {
      setResult(numberInput * getCurrencyValueTo.value);
    }
  };

  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-slate-50 font-sans">
      <div className="bg-blue-900 text-white font-bold rounded-sm p-2 flex mb-2 w-full font-sans border-gray-400 border-b-2">
      <BsCurrencyExchange />
        <p className='text-xxl pl-2'>Welcome to Currency Exchange</p>
      </div>
      <button 
        onClick={handleClick} 
        className="hover:bg-black hover:text-white ml-4 p-2 border bg-white border-gray-300 rounded">
        {start ? "Start Exchange" : "Currency From"}
      </button>

      {isShowCurrencyFrom && (
        <section className="mt-4">
          {start ? "" : <h2>Select currency from:</h2>}
          {start ? "" : <hr className='border border-blue-300'/>}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {chunkArray(currencies, 1).map((chunk, chunkIndex) => (
            <div key={chunkIndex} className="flex flex-col space-y-2">
              {chunk.map(([key, value]) => (
                <button 
                  onClick={() => {
                    setSelectedCurrency(key);
                    console.log(selectedCurrency);
                    setIsShowCurrencyFrom(false);
                    setIsShowCurrencyFromCurrencyTo(true);
                  }} 
                  key={key} 
                  className="block hover:bg-slate-400 rounded-md p-2">
                  {key}: {value}
                  <hr className='border border-black'/>
                </button>
              ))}
            </div>
          ))}
          </div>
        </section>
      )}

      {!isShowCurrencyFrom && isShowCurrencyTo && (
        <section className="mt-4">
          <div className='#'>
            <h2>Select currency exchange to (displayed convert currency from 1 {selectedCurrency}):</h2>
            <p>Date: {currencyDate}</p>
            <hr className='border border-blue-300'/>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {chunkArray(Object.entries(currencyDetails), 1).map((chunk, chunkIndex) => (
            <div key={chunkIndex} className="flex flex-col space-y-2">
              {chunk.map(([key, value]) => (
                <button 
                  key={key}
                  onClick={() => handleCurrencyDetailsClick(key, value)}
                  className="block hover:bg-slate-400 rounded-md p-2">
                  {key}: {value}
                  <hr className='border border-black'/>
                </button>
              ))}
            </div>
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
              placeholder="Insert the nominal"
              required
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
