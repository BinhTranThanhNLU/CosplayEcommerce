import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react"; // Đảm bảo đã import icon này

// Định nghĩa dữ liệu ảo phục vụ hiển thị giống thiết kế mẫu
const stats = [
  { value: "500+", label: "Trang phục" },
  { value: "10K+", label: "Đơn hàng" },
  { value: "4.9★", label: "Đánh giá" },
];

const heroBadges = [
  "Giao toàn quốc",
  "Đổi trả 7 ngày",
  "Hàng chính hãng",
  "10.000+ đơn",
];

const recentOrders = [
  {
    name: "Nezuko Kamado",
    series: "Demon Slayer",
    type: "Đặt may",
    time: "2 phút",
  },
  { name: "Rem", series: "Re:Zero", type: "Thuê 3 ngày", time: "15 phút" },
  { name: "Hu Tao", series: "Genshin Impact", type: "Mua", time: "1 giờ" },
];

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative min-h-[92vh] lg:min-h-[88vh]">
        {/* Vùng chứa ảnh nền phía bên phải (Tràn viền và có Gradient che phủ) */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[58%]">
          <img
            src="https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1200&h=1600&fit=crop&crop=top"
            alt="Cosplay trang phục chất lượng cao"
            className="h-full w-full object-cover object-top"
          />
          {/* Lớp phủ chuyển mờ từ trái sang phải cho màn hình máy tính */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent lg:via-background/20" />
          {/* Lớp phủ chuyển mờ từ dưới lên trên cho màn hình điện thoại */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent lg:hidden" />
        </div>

        {/* Nội dung căn giữa khối */}
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-24 md:px-6 lg:py-0">
          <div className="flex min-h-[92vh] flex-col justify-center lg:min-h-[88vh] lg:max-w-[52%]">
            {/* Nhãn giới thiệu đầu trang */}
            <div className="mb-6 flex items-center gap-2">
              <span className="h-px w-8 bg-primary" />
              <span className="text-sm font-semibold tracking-[0.12em] text-primary uppercase">
                Nền tảng cosplay Việt Nam
              </span>
            </div>

            {/* Tiêu đề chính */}
            <h1 className="text-[clamp(2.75rem,7vw,5rem)] leading-[1.02] font-extrabold tracking-tight text-foreground">
              Hóa thân thành <span className="text-primary">nhân vật</span> bạn
              yêu thích
            </h1>

            {/* Đoạn mô tả */}
            <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
              Mua, thuê hoặc đặt may trang phục cosplay chất lượng cao. Hơn 500
              bộ từ anime, game, phim, giao toàn quốc.
            </p>

            {/* Cặp nút hành động */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Khám phá ngay <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/rental/1"
                className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-8 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Xem trang phục thuê
              </Link>
            </div>

            {/* Khối huy hiệu nổi bật */}
            <div className="mt-6 flex flex-wrap gap-2">
              {heroBadges.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full bg-muted px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Khối thống kê chỉ số */}
            <div className="mt-10 grid grid-cols-3 gap-4 pt-8 relative">
              {/* Đường vạch kẻ ngang ngăn cách thanh lịch */}
              <div className="absolute top-0 left-0 right-0 h-px bg-border/60" />
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold text-foreground">
                    {s.value}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Khối danh sách đơn hàng vừa đặt */}
            <div className="mt-8 pt-6 relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-border/60" />
              <p className="mb-3 text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase">
                Vừa có đơn
              </p>
              <div className="flex flex-col gap-0">
                {recentOrders.map((order, i) => (
                  <div
                    key={order.name}
                    className={`flex items-center justify-between py-3 ${
                      i < recentOrders.length - 1
                        ? "border-b border-border/30"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        {order.name}
                      </span>
                      <span className="hidden text-sm text-muted-foreground sm:inline">
                        {order.series}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="hidden text-sm text-muted-foreground sm:inline">
                        {order.type}
                      </span>
                      <span className="shrink-0 text-sm text-muted-foreground">
                        {order.time} trước
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
