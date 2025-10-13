import { useEffect, useState } from 'react';
import { pingServer } from '../api/ping';

export default function PingTest() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    pingServer()
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Ping Test</h1>
      <p>Server says: {message}</p>
    </div>
  );
}