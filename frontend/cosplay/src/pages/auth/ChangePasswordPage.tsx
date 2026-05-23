import { Link, useParams } from "react-router-dom";
import { AuthShell } from "../../components/Auth/AuthShell";

const changeStats = [
  { value: "1 lần", label: "đặt lại" },
  { value: "Mã token", label: "xác thực" },
];

export default function ChangePasswordPage() {
  const { token } = useParams();

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
      <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
        {token && (
          <div className="rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            Mã xác nhận: <span className="font-semibold text-foreground">{token}</span>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="new-password" className="text-sm text-foreground">
            Mật khẩu mới
          </label>
          <input
            id="new-password"
            type="password"
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
            placeholder="Nhập lại mật khẩu mới"
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
          />
        </div>

        <button
          type="submit"
          className="h-11 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Cập nhật mật khẩu
        </button>

        <div className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="font-medium text-brand hover:text-brand/80">
            Quay lại đăng nhập
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}