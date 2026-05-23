import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthShell } from "../../components/Auth/AuthShell";
import { login } from "../../apis/authApi";
import { saveAuthSession } from "../../utils/authStorage";
import { Eye, EyeOff } from "lucide-react";

type LoginValues = {
  email: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginValues, string>>;

type LocationState = {
  message?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateLoginValues = (values: LoginValues): LoginErrors => {
  const errors: LoginErrors = {};
  const email = values.email.trim();

  if (!email) {
    errors.email = "Email không được để trống";
  } else if (!emailRegex.test(email)) {
    errors.email = "Email không hợp lệ";
  }

  if (!values.password.trim()) {
    errors.password = "Mật khẩu không được để trống";
  }

  return errors;
};

const mapLoginServerError = (message: string): LoginErrors => {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("sai email hoặc mật khẩu")) {
    return {
      email: message,
      password: message,
    };
  }

  if (normalizedMessage.includes("email")) {
    return { email: message };
  }

  if (normalizedMessage.includes("mật khẩu") || normalizedMessage.includes("password")) {
    return { password: message };
  }

  return {};
};

const loginStats = [
  { value: "500+", label: "bộ cosplay" },
  { value: "24h", label: "hỗ trợ" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = (location.state as LocationState | null)?.message;

  const [values, setValues] = useState<LoginValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [touched, setTouched] = useState<Record<keyof LoginValues, boolean>>({
    email: false,
    password: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const shouldShowError = (field: keyof LoginValues) => submitted || touched[field];

  const handleChange = (field: keyof LoginValues) => (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const nextValues = { ...values, [field]: event.target.value };
    setValues(nextValues);

    if (submitted || touched[field]) {
      setErrors(validateLoginValues(nextValues));
    }

    if (generalError) {
      setGeneralError("");
    }
  };

  const handleBlur = (field: keyof LoginValues) => {
    const nextTouched = { ...touched, [field]: true };
    setTouched(nextTouched);
    setErrors(validateLoginValues(values));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setGeneralError("");

    const nextErrors = validateLoginValues(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await login({
        email: values.email.trim(),
        password: values.password,
      });

      saveAuthSession({ token: response.token, user: response.user });
      navigate("/", { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = (error.response?.data as { message?: string } | undefined)?.message;

        if (message) {
          const mappedErrors = mapLoginServerError(message);

          if (Object.keys(mappedErrors).length > 0) {
            setErrors((currentErrors) => ({
              ...currentErrors,
              ...mappedErrors,
            }));
            return;
          }

          setGeneralError(message);
          return;
        }
      }

      setGeneralError("Không thể đăng nhập lúc này. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Đăng nhập"
      description="Truy cập tài khoản để theo dõi đơn hàng, lưu trang phục yêu thích và nhận ưu đãi dành riêng cho bạn."
      imageSrc="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&h=1800&fit=crop"
      imageAlt="Không gian cosplay nghệ thuật"
      imageLabel="Tài khoản"
      imageTitle="Đăng nhập để tiếp tục mua sắm."
      stats={loginStats}
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        {successMessage ? (
          <div className="rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-brand-foreground">
            {successMessage}
          </div>
        ) : null}

        {generalError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {generalError}
          </div>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="login-email" className="text-sm text-foreground">
            Email
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
              @
            </span>
            <input
              id="login-email"
              type="text"
              inputMode="email"
              autoComplete="email"
              placeholder="ban@cosplay.vn"
              value={values.email}
              onChange={handleChange("email")}
              onBlur={() => handleBlur("email")}
              aria-invalid={shouldShowError("email")}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              className={`h-11 w-full rounded-xl border bg-background pr-4 pl-10 text-sm text-foreground outline-none transition-colors focus:border-primary ${
                shouldShowError("email") && errors.email
                  ? "border-destructive focus:border-destructive"
                  : "border-border"
              }`}
            />
          </div>
          {shouldShowError("email") && errors.email ? (
            <p id="login-email-error" className="text-xs text-destructive">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="login-password" className="text-sm text-foreground">
            Mật khẩu
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
              🔒
            </span>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Nhập mật khẩu"
              value={values.password}
              onChange={handleChange("password")}
              onBlur={() => handleBlur("password")}
              aria-invalid={shouldShowError("password")}
              aria-describedby={errors.password ? "login-password-error" : undefined}
              className={`h-11 w-full rounded-xl border bg-background pr-12 pl-10 text-sm text-foreground outline-none transition-colors focus:border-primary ${
                shouldShowError("password") && errors.password
                  ? "border-destructive focus:border-destructive"
                  : "border-border"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {shouldShowError("password") && errors.password ? (
            <p id="login-password-error" className="text-xs text-destructive">
              {errors.password}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input id="remember-me" type="checkbox" className="size-4 rounded border-border" />
            <span>Ghi nhớ đăng nhập</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-sm font-medium text-brand transition-colors hover:text-brand/80"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div className="flex items-center gap-4 py-1">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
            Hoặc
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="h-11 rounded-full border border-border bg-background text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Google
          </button>
          <button
            type="button"
            className="h-11 rounded-full border border-border bg-background text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Apple
          </button>
        </div>

        <p className="pt-2 text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="font-medium text-brand hover:text-brand/80">
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
