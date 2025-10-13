import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:5001/api/ping')
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((err) => {
        console.error('❌ Error fetching:', err);
        setMessage('Error connecting to backend');
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Ping Test</h1>
      <p>Backend says: <strong>{message}</strong></p>
    </div>
  );
}

export default App;