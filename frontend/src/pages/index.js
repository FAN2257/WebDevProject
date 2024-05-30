import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/data');
      const result = await res.json();
      setData(result);
    };
  
    fetchData();
  }, []);
  
  if (!data) {
    return <div>Loading...</div>;
  }
    
  return (
    <div>
      Hello World
    </div>
  );
}
