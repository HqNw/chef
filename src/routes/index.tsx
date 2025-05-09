import { lazy, Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import PublicLayout from "@/layouts/public-layout"
import AdminLayout from "@/layouts/admin-layout"
import ProtectedRoute from "@/components/protected-route"
import LoadingScreen from "@/components/loading-screen"

// Public Pages
const Home = lazy(() => import("@/pages/home"))
const Menu = lazy(() => import("@/pages/menu"))
const CategoryPage = lazy(() => import("@/pages/category"))
const AboutUs = lazy(() => import("@/pages/about-us"))
const Contact = lazy(() => import("@/pages/contact"))
const Cart = lazy(() => import("@/pages/cart"))
const Checkout = lazy(() => import("@/pages/checkout"))
const OrderSuccess = lazy(() => import("@/pages/order-success"))
const Login = lazy(() => import("@/pages/login"))
const Register = lazy(() => import("@/pages/register"))
const UserAccount = lazy(() => import("@/pages/user-account"))

// Admin Pages
const Dashboard = lazy(() => import("@/pages/admin/dashboard"))
const OrdersManagement = lazy(() => import("@/pages/admin/orders"))
const ProductsManagement = lazy(() => import("@/pages/admin/products"))
const CustomersManagement = lazy(() => import("@/pages/admin/customers"))
const OffersManagement = lazy(() => import("@/pages/admin/offers"))
const Analytics = lazy(() => import("@/pages/admin/analytics"))
const Settings = lazy(() => import("@/pages/admin/settings"))

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success/:id" element={<OrderSuccess />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="account"
            element={
              <ProtectedRoute>
                <UserAccount />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="customers" element={<CustomersManagement />} />
          <Route path="offers" element={<OffersManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
