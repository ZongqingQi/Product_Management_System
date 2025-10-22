import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginProvider } from "./context/LoginContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import CreateProductPage from "./pages/CreateProductPage";
import EditProductPage from "./pages/EditProductPage";
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from "./pages/CartPage";

function App() {
  return (
    <ErrorBoundary>
      <LoginProvider>
        <Router>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />

            <Route
              path="/create"
              element={
                <ProtectedRoute requiredRole="admin">
                  <CreateProductPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute requiredRole="admin">
                  <EditProductPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </Router>
    </LoginProvider>
    </ErrorBoundary>
  );
}

export default App;
