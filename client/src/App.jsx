import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginProvider } from './context/LoginContext'; // ✅ 引入
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CreateProductPage from './pages/CreateProductPage';
import EditProductPage from './pages/EditProductPage';

function App() {
  return (
    <LoginProvider>
      <Router>
        <Navbar /> {/* ✅ Navbar 在 Provider 之内 */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/create" element={<CreateProductPage />} />
            <Route path="/edit/:id" element={<EditProductPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </LoginProvider>
  );
}

export default App;
