import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  UserCircle2,
  X,
} from "lucide-react";
import {
  clearAuthSession,
  getDisplayName,
  getStoredAuthSession,
  getUserInitials,
  subscribeToAuthSession,
} from "../../utils/authStorage";

const navLinks = [
  { label: "Mua ngay", href: "/products" },
  { label: "Đặt may", href: "/custom-order" },
];

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authSession, setAuthSession] = useState(() => getStoredAuthSession());
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const isAuthenticated = Boolean(authSession.token && authSession.user);
  const displayName = useMemo(() => getDisplayName(authSession.user), [authSession.user]);
  const userInitials = useMemo(() => getUserInitials(authSession.user), [authSession.user]);

  useEffect(() => {
    const syncAuthSession = () => {
      setAuthSession(getStoredAuthSession());
    };

    return subscribeToAuthSession(syncAuthSession);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-foreground">
            cosplay<span className="text-primary">.vn</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Hành động (Search, Cart, User, Mobile Menu) */}
        <div className="flex items-center gap-2">
          {/* Icon Tìm kiếm (Ẩn trên mobile) */}
          <Link
            to="/search"
            className="hidden h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:flex"
            aria-label="Tìm kiếm"
          >
            <Search className="h-5 w-5" />
          </Link>

          {/* Icon Giỏ hàng */}
          <Link
            to="/cart"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Giỏ hàng"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {isAuthenticated ? (
            <div ref={userMenuRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setUserMenuOpen((open) => !open)}
                className="flex h-10 items-center gap-3 rounded-full border border-border bg-background px-3 pr-4 text-left transition-colors hover:bg-muted"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {userInitials}
                </span>
                <span className="hidden min-w-0 flex-col text-left sm:flex">
                  <span className="truncate text-sm font-medium text-foreground">
                    {displayName}
                  </span>
                  <span className="text-xs text-muted-foreground">Tài khoản của bạn</span>
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {userMenuOpen ? (
                <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-border bg-background shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
                  <div className="border-b border-border/60 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UserCircle2 className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {displayName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          Đã đăng nhập thành công
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      to="/change-password"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <UserCircle2 className="h-4 w-4" />
                      </span>
                      <span className="flex-1 text-left">Đổi mật khẩu</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <LogOut className="h-4 w-4" />
                      </span>
                      <span className="flex-1 text-left">Đăng xuất</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden h-9 items-center justify-center rounded-full border border-border bg-transparent px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted md:flex"
            >
              Đăng nhập
            </Link>
          )}

          {/* Nút Menu Mobile */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="border-t border-border/60 bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/search"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Tìm kiếm
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Giỏ hàng
            </Link>
            <div className="mt-2 border-t border-border/60 pt-2">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/40 px-3 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {userInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {displayName}
                      </p>
                      <p className="text-xs text-muted-foreground">Tài khoản của bạn</p>
                    </div>
                  </div>

                  <Link
                    to="/change-password"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-9 w-full items-center justify-center rounded-full border border-border text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Đổi mật khẩu
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex h-9 w-full items-center justify-center rounded-full border border-destructive/20 bg-destructive/10 text-sm font-medium text-destructive transition-colors hover:bg-destructive/15"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-9 w-full items-center justify-center rounded-full border border-border text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
