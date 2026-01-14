import { Routes, Route } from 'react-router-dom';
import CustomerLayout from './components/common/CustomerLayout';
import AdminLayout from './components/common/AdminLayout';
import PublicOnlyRoute from './components/common/PublicOnlyRoute';
import AdminProtectedRoute from './components/common/AdminProtectedRoute';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CategoriesPage from './pages/CategoriesPage';
// import { ProductsPage } from './pages/ProductsPage';
import AccountsPage from './pages/AccountsPage';
import InvoicesPage from './pages/InvoicesPage';

function App() {
  return (
    <Routes>
      {/* Public routes with customer layout */}
      <Route element={<CustomerLayout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/products/:id' element={<ProductDetailPage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/checkout' element={<CheckoutPage />} />
        <Route path='/payment-success' element={<PaymentSuccessPage />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Admin routes with admin layout */}
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path='/admin' element={<AdminDashboardPage />} />
          <Route path='/admin/categories' element={<CategoriesPage />} />
          {/* <Route path='/admin/products' element={<ProductsPage />} />
          <Route path='/admin/accounts' element={<AccountsPage />} />
          <Route path='/admin/invoices' element={<InvoicesPage />} /> */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
