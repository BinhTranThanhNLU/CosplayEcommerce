import { Link } from "react-router-dom";
import { Camera, Play, Share2 } from "lucide-react";

// Định nghĩa mảng liên kết đầy đủ
const footerLinks = {
  "Dịch vụ": [
    { label: "Mua trang phục", href: "/products" },
    { label: "Thuê trang phục", href: "/rental/1" },
    { label: "Đặt may theo yêu cầu", href: "/custom-order" },
    { label: "Phụ kiện cosplay", href: "/products" },
  ],
  "Hỗ trợ": [
    { label: "Hướng dẫn chọn size", href: "#size-guide" },
    { label: "Chính sách đổi trả", href: "#return" },
    { label: "Câu hỏi thường gặp", href: "#faq" },
    { label: "Liên hệ", href: "#contact" },
  ],
  "Về chúng tôi": [
    { label: "Giới thiệu", href: "#about" },
    { label: "Blog cosplay", href: "#blog" },
    { label: "Sự kiện", href: "#events" },
    { label: "Tuyển dụng", href: "#careers" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Cột 1: Thông tin thương hiệu & Mạng xã hội */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-background">
                cosplay<span className="text-primary">.vn</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-background/65">
              Nền tảng cosplay hàng đầu Việt Nam: mua, thuê và đặt may trang
              phục chất lượng cao.
            </p>

            {/* Các Icon Mạng Xã Hội dùng Lucide React */}
            <div className="mt-4 flex gap-3">
              {[
                { icon: Share2, label: "Facebook" },
                { icon: Camera, label: "Instagram" },
                { icon: Play, label: "Youtube" },
              ].map(({ icon: Icon, label }) => (
                <Link
                  key={label}
                  to="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 transition-colors hover:bg-background/20"
                >
                  <Icon className="h-4 w-4 text-background" />
                </Link>
              ))}
            </div>
          </div>

          {/* Cột 2, 3, 4: Các nhóm liên kết nội bộ */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-background">{title}</h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-background/65 transition-colors hover:text-background"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Thay Separator bằng Div thuần Tailwind CSS */}
        <div className="my-8 h-px w-full bg-background/10" />

        {/* Chân trang: Bản quyền & Ghi chú công nghệ */}
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-background/50 md:flex-row">
          <p>© 2026 cosplay.vn — Bản quyền thuộc về cosplay.vn</p>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-background transition-colors">
              Chính sách bảo mật
            </Link>
            <Link to="#" className="hover:text-background transition-colors">
              Điều khoản sử dụng
            </Link>
          </div>
          <p className="text-background/30">React + Tailwind + React Router</p>
        </div>
      </div>
    </footer>
  );
}
