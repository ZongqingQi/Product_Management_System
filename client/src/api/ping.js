export async function pingServer() {
  const res = await fetch('http://localhost:5000/api/ping');
  if (!res.ok) throw new Error('Ping failed');
  return res.json();
}