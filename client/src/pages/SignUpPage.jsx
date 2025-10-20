import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('regular');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5001/api/users/signup', {
        name,
        email,
        password,
        role,
      });

      console.log('Signup success:', res.data);
      alert('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      const msg = err.response?.data?.message || 'Registration failed.';
      setError(msg);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', textAlign: 'center' }}>
      <h2>Sign Up</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        <input
          type="text"
          placeholder="Enter your nickname"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="regular">Regular User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Sign Up</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginTop: '15px' }}>
        <Link to="/login">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default SignUpPage;