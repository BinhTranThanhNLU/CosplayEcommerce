import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UserLayout } from "./layouts/UserLayout";
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

          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ChangePasswordPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
