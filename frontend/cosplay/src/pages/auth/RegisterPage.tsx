import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "../../components/Auth/AuthShell";
import { register } from "../../apis/authApi";
import { Eye, EyeOff } from "lucide-react";

type RegisterValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterErrors = Partial<Record<keyof RegisterValues, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validateRegisterValues = (values: RegisterValues): RegisterErrors => {
  const errors: RegisterErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const password = values.password;
  const confirmPassword = values.confirmPassword;

  if (!name) {
    errors.name = "Tên không được để trống";
  } else if (name.length > 100) {
    errors.name = "Tên không được vượt quá 100 ký tự";
  }

  if (!email) {
    errors.email = "Email không được để trống";
  } else if (email.length > 150) {
    errors.email = "Email không được vượt quá 150 ký tự";
  } else if (!emailRegex.test(email)) {
    errors.email = "Định dạng email không hợp lệ";
  }

  if (!password) {
    errors.password = "Mật khẩu không được để trống";
  } else if (password.length < 8 || password.length > 100) {
    errors.password = "Mật khẩu phải từ 8 đến 100 ký tự";
  } else if (!passwordRegex.test(password)) {
    errors.password = "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Vui lòng nhập lại mật khẩu";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Mật khẩu nhập lại không khớp";
  }

  return errors;
};

const mapRegisterServerError = (message: string): RegisterErrors => {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("email") && normalizedMessage.includes("đã được đăng ký")) {
    return { email: message };
  }

  if (normalizedMessage.includes("email")) {
    return { email: message };
  }

  if (normalizedMessage.includes("mật khẩu") || normalizedMessage.includes("password")) {
    return { password: message };
  }

  if (normalizedMessage.includes("tên")) {
    return { name: message };
  }

  return {};
};

const registerStats = [
  { value: "3 bước", label: "đăng ký" },
  { value: "0 phí", label: "khởi tạo" },
];

export default function RegisterPage() {
  const navigate = useNavigate();

  const [values, setValues] = useState<RegisterValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [touched, setTouched] = useState<Record<keyof RegisterValues, boolean>>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const shouldShowError = (field: keyof RegisterValues) => submitted || touched[field];

  const handleChange = (field: keyof RegisterValues) => (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const nextValues = { ...values, [field]: event.target.value };
    setValues(nextValues);

    if (submitted || touched[field]) {
      setErrors(validateRegisterValues(nextValues));
    }

    if (generalError) {
      setGeneralError("");
    }
  };

  const handleBlur = (field: keyof RegisterValues) => {
    const nextTouched = { ...touched, [field]: true };
    setTouched(nextTouched);
    setErrors(validateRegisterValues(values));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setGeneralError("");

    const nextErrors = validateRegisterValues(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        role: "customer",
      });

      navigate("/login", {
        replace: true,
        state: { message: "Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ." },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = (error.response?.data as { message?: string } | undefined)?.message;

        if (message) {
          const mappedErrors = mapRegisterServerError(message);

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

      setGeneralError("Không thể đăng ký lúc này. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Đăng ký"
      description="Tạo tài khoản để lưu địa chỉ giao hàng, theo dõi đơn và quản lý các đơn thuê trang phục dễ dàng hơn."
      imageSrc="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1400&h=1800&fit=crop"
      imageAlt="Mẫu trang phục cosplay"
      imageLabel="Tạo tài khoản"
      imageTitle="Một tài khoản để mua, thuê và đặt may mọi thứ."
      stats={registerStats}
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        {generalError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {generalError}
          </div>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="register-name" className="text-sm text-foreground">
            Họ và tên
          </label>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Nguyễn Văn A"
            value={values.name}
            onChange={handleChange("name")}
            onBlur={() => handleBlur("name")}
            aria-invalid={shouldShowError("name")}
            aria-describedby={errors.name ? "register-name-error" : undefined}
            className={`h-11 w-full rounded-xl border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary ${
              shouldShowError("name") && errors.name
                ? "border-destructive focus:border-destructive"
                : "border-border"
            }`}
          />
          {shouldShowError("name") && errors.name ? (
            <p id="register-name-error" className="text-xs text-destructive">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="register-email" className="text-sm text-foreground">
            Email
          </label>
          <input
            id="register-email"
            type="text"
            inputMode="email"
            autoComplete="email"
            placeholder="ban@cosplay.vn"
            value={values.email}
            onChange={handleChange("email")}
            onBlur={() => handleBlur("email")}
            aria-invalid={shouldShowError("email")}
            aria-describedby={errors.email ? "register-email-error" : undefined}
            className={`h-11 w-full rounded-xl border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary ${
              shouldShowError("email") && errors.email
                ? "border-destructive focus:border-destructive"
                : "border-border"
            }`}
          />
          {shouldShowError("email") && errors.email ? (
            <p id="register-email-error" className="text-xs text-destructive">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="register-password" className="text-sm text-foreground">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Tối thiểu 8 ký tự"
              value={values.password}
              onChange={handleChange("password")}
              onBlur={() => handleBlur("password")}
              aria-invalid={shouldShowError("password")}
              aria-describedby={errors.password ? "register-password-error" : undefined}
              className={`h-11 w-full rounded-xl border bg-background pr-12 pl-4 text-sm text-foreground outline-none transition-colors focus:border-primary ${
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
            <p id="register-password-error" className="text-xs text-destructive">
              {errors.password}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="register-confirm" className="text-sm text-foreground">
            Nhập lại mật khẩu
          </label>
          <div className="relative">
            <input
              id="register-confirm"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu"
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              onBlur={() => handleBlur("confirmPassword")}
              aria-invalid={shouldShowError("confirmPassword")}
              aria-describedby={errors.confirmPassword ? "register-confirm-error" : undefined}
              className={`h-11 w-full rounded-xl border bg-background pr-12 pl-4 text-sm text-foreground outline-none transition-colors focus:border-primary ${
                shouldShowError("confirmPassword") && errors.confirmPassword
                  ? "border-destructive focus:border-destructive"
                  : "border-border"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {shouldShowError("confirmPassword") && errors.confirmPassword ? (
            <p id="register-confirm-error" className="text-xs text-destructive">
              {errors.confirmPassword}
            </p>
          ) : null}
        </div>

        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input type="checkbox" className="mt-1 size-4 rounded border-border" />
          <span>
            Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật của cosplay.vn.
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </button>

        <p className="pt-2 text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link to="/login" className="font-medium text-brand hover:text-brand/80">
            Đăng nhập
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
