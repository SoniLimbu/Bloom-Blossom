import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

// Customer Pages
import CustomerDashboard from './pages/CustomerDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOffers from './pages/admin/AdminOffers';
import AdminUsers from './pages/admin/AdminUsers';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/shop" element={<PublicLayout><Shop /></PublicLayout>} />
      <Route path="/product/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
      <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Customer */}
      <Route path="/checkout" element={<ProtectedRoute><PublicLayout><Checkout /></PublicLayout></ProtectedRoute>} />
      <Route path="/order-success/:id" element={<ProtectedRoute><PublicLayout><OrderSuccess /></PublicLayout></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><PublicLayout><CustomerDashboard /></PublicLayout></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
      <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
      <Route path="/admin/offers" element={<AdminRoute><AdminOffers /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
