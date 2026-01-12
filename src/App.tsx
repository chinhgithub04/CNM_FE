import { Routes, Route } from 'react-router-dom';
import CustomerLayout from './components/common/CustomerLayout';
import AdminLayout from './components/common/AdminLayout';
import PublicOnlyRoute from './components/common/PublicOnlyRoute';
import AdminProtectedRoute from './components/common/AdminProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <Routes>
      {/* Public routes with customer layout */}
      <Route element={<CustomerLayout />}>
        <Route path='/' element={<HomePage />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Admin routes with admin layout */}
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path='/admin' element={<AdminDashboardPage />} />
          {/* Add more admin routes here */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
