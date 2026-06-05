import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { AuthShell } from "../../components/Auth/AuthShell";
import { useState } from "react";
import { resetPassword } from "../../apis/authApi";

const changeStats = [
  { value: "1 lần", label: "đặt lại" },
  { value: "Mã token", label: "xác thực" },
];

export default function ChangePasswordPage() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!token) {
      setErrorMessage("Token không hợp lệ");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setIsLoading(true);

      const message = await resetPassword({
        token,
        newPassword,
      });

      setSuccessMessage(message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || "Không thể đặt lại mật khẩu",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Đổi mật khẩu"
      description="Tạo mật khẩu mới cho tài khoản của bạn sau khi xác nhận link khôi phục hợp lệ."
      imageSrc="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1400&h=1800&fit=crop"
      imageAlt="Không gian studio cosplay"
      imageLabel="Bảo mật tài khoản"
      imageTitle="Đặt lại mật khẩu và quay lại ngay."
      stats={changeStats}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {!token && (
          <div className="rounded-xl border border-red-500 bg-red-50 p-3 text-sm text-red-600">
            Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="new-password" className="text-sm text-foreground">
            Mật khẩu mới
          </label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Tối thiểu 8 ký tự"
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm-password" className="text-sm text-foreground">
            Xác nhận mật khẩu mới
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
          />
        </div>

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

        <button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
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
