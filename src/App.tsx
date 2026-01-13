import { Routes, Route } from 'react-router-dom';
import CustomerLayout from './components/common/CustomerLayout';
import PublicOnlyRoute from './components/common/PublicOnlyRoute';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Routes>
      {/* Public routes with layout */}
      <Route element={<CustomerLayout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/products/:id' element={<ProductDetailPage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Auth routes without layout */}
    </Routes>
  );
}

export default App;
