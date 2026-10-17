import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { setCredentials, finishInitializing } from './store/slices/authSlice';

import { ProtectedRoute, AdminRoute, GuestOnlyRoute } from './routes/RouteGuards';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import ScrollToTop from './components/layout/ScrollToTop';

import Home from './pages/Home';
import Contact from './pages/Contact';
import CmsPage from './pages/CmsPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import DashboardHome from './pages/dashboard/DashboardHome';
import Addresses from './pages/dashboard/Addresses';
import MyOrders from './pages/dashboard/MyOrders';
import OrderDetail from './pages/dashboard/OrderDetail';
import Wallet from './pages/dashboard/Wallet';
import Rewards from './pages/dashboard/Rewards';
import Referrals from './pages/dashboard/Referrals';
import MyTestimonials from './pages/dashboard/MyTestimonials';
import AccountSettings from './pages/dashboard/AccountSettings'; // adjust path
import Subscriptions from './pages/dashboard/Subscriptions';
import Shop from './pages/shop/Shop';
import ProductDetail from './pages/shop/ProductDetail';
import Cart from './pages/cart/Cart';
import Wishlist from './pages/wishlist/Wishlist';
import ComparePage from './pages/shop/ComparePage';
import Festivegifting from './pages/shop/festive-gifting'
import GiftHamperBuilder from './pages/shop/GiftHamperBuilder';
import Checkout from './pages/checkout/Checkout';
import OrderSuccess from './pages/checkout/OrderSuccess';
import OrderFailed from './pages/checkout/OrderFailed';
import BlogList from './pages/blog/BlogList';
import BlogDetail from './pages/blog/BlogDetail';
import Artisans from './pages/content/Artisans';
import ArtisanDetail from './pages/content/ArtisanDetail';
import Sustainability from './pages/content/Sustainability';
import KnowledgeCenter from './pages/content/KnowledgeCenter';
import BambooSpeciesDetail from './pages/content/BambooSpeciesDetail';
import VerifyProduct from './pages/content/VerifyProduct';
import Certificates from './pages/content/Certificates';
import NotFound from './pages/NotFound';

import AdminVideoShowcase from './pages/admin/AdminVideoShowcase';
import AdminVideos from './pages/admin/AdminVideos';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminReviews from './pages/admin/AdminReviews';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminCms from './pages/admin/AdminCms';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminContactQueries from './pages/admin/AdminContactQueries';
import AdminSettings from './pages/admin/AdminSettings';
import AdminWarehouses from './pages/admin/AdminWarehouses';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminBackups from './pages/admin/AdminBackups';
import AdminPromotions from './pages/admin/AdminPromotions';
import AdminContent from './pages/admin/AdminContent';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminFeatures from './pages/admin/AdminFeatures';
import AdminNewsletter from './pages/admin/AdminNewsletter'
import ProductReviews from './pages/shop/ProductReviews';

function App() {
  const dispatch = useDispatch();

// Runs once when the app starts.
// Checks if the user already has a valid login session using the refresh token.
// If yes, it logs the user in automatically and updates Redux.
// If not, it simply marks authentication initialization as complete.
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const refreshResponse = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/refresh-token`,
          { method: 'POST', credentials: 'include' }
        );
        if (!refreshResponse.ok) throw new Error('No active session');
        const refreshData = await refreshResponse.json();
        dispatch(
          setCredentials({ user: refreshData.data.user, accessToken: refreshData.data.accessToken })
        );
      } catch {
        dispatch(finishInitializing());
      }
    };
    bootstrapAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet titleTemplate="%s | Wa-Kriti" defaultTitle="Wa-Kriti | Premium Bamboo Living" />
      <ScrollToTop />

      <Routes>
        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/gift-hamper" element={<GiftHamperBuilder />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/artisans" element={<Artisans />} />
          <Route path="/artisans/:slug" element={<ArtisanDetail />} />
          <Route path="/product/:slug/reviews" element={<ProductReviews />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/knowledge-center" element={<KnowledgeCenter />} />
          <Route path="/knowledge-center/:slug" element={<BambooSpeciesDetail />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/verify/:serialNumber" element={<VerifyProduct />} />
          <Route path="/festive-gifting" element={<Festivegifting />}/>
          {/* <Route path="/about" element={<CmsPage />} />
          <Route path="/founder" element={<CmsPage />} />
          <Route path="/privacy-policy" element={<CmsPage />} />
          <Route path="/refund-policy" element={<CmsPage />} />
          <Route path="/shipping-policy" element={<CmsPage />} />
          <Route path="/cancellation-policy" element={<CmsPage />} />
          <Route path="/terms-and-conditions" element={<CmsPage />} />
          <Route path="/accessibility-statement" element={<CmsPage />} /> */}
          <Route path="/about" element={<CmsPage slug="about-us" />} />
          <Route path="/founder" element={<CmsPage slug="founder" />} />
          <Route path="/privacy-policy" element={<CmsPage slug="privacy-policy" />} />
          <Route path="/refund-policy" element={<CmsPage slug="refund-policy" />} />
          <Route path="/shipping-policy" element={<CmsPage slug="shipping-policy" />} />
          <Route path="/cancellation-policy" element={<CmsPage slug="cancellation-policy" />} />
          <Route path="/terms-and-conditions" element={<CmsPage slug="terms-and-conditions" />} />
          <Route path="/accessibility-statement" element={<CmsPage slug="accessibility-statement" />} />

          <Route element={<GuestOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
 
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/addresses" element={<Addresses />} />
            <Route path="/dashboard/orders" element={<MyOrders />} />
            <Route path="/dashboard/orders/:id" element={<OrderDetail />} />
            <Route path="/dashboard/wallet" element={<Wallet />} />
            <Route path="/dashboard/rewards" element={<Rewards />} />
            <Route path="/dashboard/referrals" element={<Referrals />} />
            <Route path="/dashboard/testimonials" element={<MyTestimonials />} />
            <Route path="/dashboard/subscriptions" element={<Subscriptions />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/order-failed" element={<OrderFailed />} />
            <Route path="/dashboard/settings" element={<AccountSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />

        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
            <Route path="/admin/coupons" element={<AdminCoupons />} />
            <Route path="/admin/promotions" element={<AdminPromotions />} />
            <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
            <Route path="/admin/warehouses" element={<AdminWarehouses />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/cms" element={<AdminCms />} />
            <Route path="/admin/blogs" element={<AdminBlogs />} />
            <Route path="/admin/contact-queries" element={<AdminContactQueries />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
            <Route path="/admin/backups" element={<AdminBackups />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/features" element={<AdminFeatures />} /> 
            <Route path="/admin/testimonials" element={<AdminTestimonials />} />
             <Route path="/admin/video-showcase" element={<AdminVideoShowcase />} />
             <Route path="/admin/video" element={<AdminVideos />} />
             <Route path="/admin/newsletter" element={<AdminNewsletter />} />

          </Route>
        </Route>
        
      </Routes>
    </>
  );
}

export default App;
