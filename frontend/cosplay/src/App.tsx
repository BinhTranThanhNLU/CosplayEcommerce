import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { HomePage } from "./pages/user/HomePage";
import { ProductCatalogPage } from "./pages/user/ProductCatalogPage";
import { ProductDetailPage } from "./pages/user/ProductDetailPage";
import { CartPage } from "./pages/user/CartPage";
import { CheckoutPage } from "./pages/user/CheckoutPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";
import { PaymentResultPage } from "./pages/user/PaymentResultPage";
import { ProfileOverviewPage } from "./pages/user/ProfileOverviewPage";
import  ProfileEditPage  from "./pages/user/ProfileEditPage";
import  ProfileMeasurementsPage  from "./pages/user/ProfileMeasurementsPage";
import  ProfileOrdersPage  from "./pages/user/ProfileOrdersPage";

import Dashboard from "./pages/admin/Dashboard";
import UsersPage from "./pages/admin/UsersPage";
import SellersPage from "./pages/admin/SellersPage";
import OrdersPage from "./pages/admin/OrdersPage";

import AdminLayout from "./layouts/AdminLayout";
import { UserLayout } from "./layouts/UserLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductCatalogPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="/payment-result" element={<PaymentResultPage />} />
          <Route path="/profile" element={<ProfileOverviewPage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/profile/measurements" element={<ProfileMeasurementsPage />} />
          <Route path="/profile/orders" element={<ProfileOrdersPage />} />
          
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ChangePasswordPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="admin" element={<Dashboard />} />
          <Route path="admin/users" element={<UsersPage />} />
          <Route path="admin/sellers" element={<SellersPage />} />
          <Route path="admin/orders" element={<OrdersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
