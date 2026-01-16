import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductPage from './pages/Product';
import ArticlePage from './pages/Article';
import UsersPage from './pages/Users';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/products" element={<ProductPage />} />
        <Route path="/dashboard/articles" element={<ArticlePage />} />
        <Route path="/dashboard/users" element={<UsersPage />} />
        {/* Jalur default jika URL tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;