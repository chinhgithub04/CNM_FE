import { Routes, Route } from 'react-router-dom';
import CustomerLayout from './components/common/CustomerLayout';
import PublicOnlyRoute from './components/common/PublicOnlyRoute';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShopPage from './pages/ShopPage'; 
import { Toaster } from '@/components/ui/sonner'; 

function App() {
  return (
    <>
      <Routes>
        {/* Public routes with layout */}
        <Route element={<CustomerLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/shop' element={<ShopPage />} /> 
          <Route path='/products/:id' element={<ProductDetailPage />} />
          
          <Route element={<PublicOnlyRoute />}>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster position="top-right" richColors closeButton toastOptions={{ style: { zIndex: 9999 } }} />
    </>
  );
}

export default App;