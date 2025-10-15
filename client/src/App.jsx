import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CreateProductPage from './pages/CreateProductPage';
import EditProductPage from './pages/EditProductPage';

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateProductPage />} />
          <Route path="/edit/:id" element={<EditProductPage />} /> 
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;