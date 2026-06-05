import { Link } from "react-router-dom";
import { AuthShell } from "../../components/Auth/AuthShell";
import { useState } from "react";
import { forgotPassword } from "../../apis/authApi";

const forgotStats = [
  { value: "5 phút", label: "khôi phục" },
  { value: "100%", label: "an toàn" },
];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    try {
      setIsLoading(true);

      const message = await forgotPassword({
        email,
      });

      setSuccessMessage(message);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Không thể gửi email khôi phục mật khẩu",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Quên mật khẩu"
      description="Nhập email tài khoản để nhận hướng dẫn đặt lại mật khẩu và quay lại mua sắm nhanh nhất có thể."
      imageSrc="https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1400&h=1800&fit=crop"
      imageAlt="Bối cảnh thời trang cosplay"
      imageLabel="Khôi phục tài khoản"
      imageTitle="Đừng lo, bạn có thể đặt lại mật khẩu trong vài phút."
      stats={forgotStats}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="forgot-email" className="text-sm text-foreground">
            Email đăng ký
          </label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ban@cosplay.vn"
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
          />

          {errorMessage && (
            <div className="rounded-xl border border-red-500 bg-red-50 p-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="rounded-xl border border-green-500 bg-green-50 p-3 text-sm text-green-600">
              {successMessage}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {isLoading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
        </button>

        <div className="text-center text-sm text-muted-foreground">
          <Link
            to="/login"
            className="font-medium text-brand hover:text-brand/80"
          >
            Quay lại đăng nhập
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
