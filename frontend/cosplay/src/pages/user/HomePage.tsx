import { Link } from "react-router-dom";
import { ArrowRight, Star, ShoppingCart } from "lucide-react";
import { Featured } from "../../components/HomeComponent/Featured";
import { Newsletter } from "../../components/HomeComponent/Newsletter";
import { Hero } from "../../components/HomeComponent/Hero";
import { Service } from "../../components/HomeComponent/Service";
import { formatPrice } from "../../components/utils/Format";

const mobileCats = [
  {
    name: "Anime",
    count: "180+ bộ",
    href: "/products?category=anime",
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=450&fit=crop",
  },
  {
    name: "Game",
    count: "120+ bộ",
    href: "/products?category=game",
    image:
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&h=450&fit=crop",
  },
  {
    name: "Phim & Series",
    count: "90+ bộ",
    href: "/products?category=movie",
    image:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&h=450&fit=crop",
  },
  {
    name: "Fantasy",
    count: "60+ bộ",
    href: "/products?category=fantasy",
    image:
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&h=450&fit=crop",
  },
];

const rentalItems = [
  {
    name: "Nezuko Kamado",
    series: "Demon Slayer",
    price: 150000,
    image:
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&h=800&fit=crop",
    available: true,
  },
  {
    name: "Rem",
    series: "Re:Zero",
    price: 180000,
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=800&fit=crop",
    available: false,
  },
  {
    name: "Sailor Moon",
    series: "Sailor Moon",
    price: 120000,
    image:
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&h=800&fit=crop",
    available: true,
  },
  {
    name: "Hu Tao",
    series: "Genshin Impact",
    price: 160000,
    image:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&h=800&fit=crop",
    available: true,
  },
];

const customOrderSteps = [
  {
    number: "01",
    title: "Gửi ý tưởng",
    time: "1-2 ngày",
    desc: "Gửi hình ảnh nhân vật, thiết kế hoặc phác thảo ý tưởng kèm số đo cơ bản của bạn.",
  },
  {
    number: "02",
    title: "Báo giá & Cọc",
    time: "Trong ngày",
    desc: "Nhận tư vấn chọn chất liệu vải, phụ kiện chi tiết cùng bảng báo giá và đặt cọc 50%.",
  },
  {
    number: "03",
    title: "May & Cập nhật",
    time: "7-14 ngày",
    desc: "Thợ may tiến hành cắt ráp. Cập nhật tiến độ trực quan bằng hình ảnh qua Zalo.",
  },
  {
    number: "04",
    title: "Duyệt & Giao hàng",
    time: "2-3 ngày",
    desc: "Xem ảnh thành phẩm hoàn thiện, thanh toán phần còn lại và nhận hàng toàn quốc.",
  },
];

const reviews = [
  {
    name: "Minh Anh (Kari)",
    service: "Thuê đồ diễn thanh lịch",
    rating: 5,
    comment:
      "Đồ sạch sẽ thơm phức luôn á mng! Mình thuê bộ Nezuko đi fes ai cũng khen vải xịn form chuẩn, lúc trả đồ cũng nhanh gọn lẹ nữa cực kì recommend.",
    avatar: "",
    initials: "MA",
  },
  {
    name: "Hoàng Long",
    service: "Đặt may Cosplay Genshin",
    rating: 5,
    comment:
      "Đường may siêu tỉ mỉ, form lên đứng dáng. Ưng nhất là shop nhắn tin cập nhật tiến độ liên tục bên Zalo làm mình rất yên tâm.",
    avatar: "",
    initials: "HL",
  },
  {
    name: "Thanh Trúc",
    service: "Mua phụ kiện & Wig",
    rating: 5,
    comment:
      "Wig mượt, đã được pre-styled sẵn form cơ bản về chỉ cần chỉnh lại chút là đeo được luôn. Đóng gói hộp giấy rất cẩn thận.",
    avatar: "",
    initials: "TT",
  },
  {
    name: "Tuấn Kiệt",
    service: "Thuê trang phục Game",
    rating: 4,
    comment:
      "Đồ đẹp, hỗ trợ nhiệt tình. Do mình chọn nhầm size ban đầu nhưng shop vẫn hỗ trợ đổi size siêu tốc cho kịp ngày đi sự kiện.",
    avatar: "",
    initials: "TK",
  },
];

// Component nội bộ hiển thị sao đánh giá nhanh
const StarRating = ({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) => {
  return (
    <div className="flex gap-0.5 text-amber-500">
      {Array.from({ length: rating }).map((_, i) => (
        <Star
          key={i}
          className={
            size === "md" ? "h-5 w-5 fill-current" : "h-4 w-4 fill-current"
          }
        />
      ))}
    </div>
  );
};

// ==========================================
// COMPONENT HOMEPAGE CHÍNH
// ==========================================

export const HomePage = () => {
  return (
    <main className="min-h-screen">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Service Perks Section */}
      <Service />

      {/* 3. Featured Products Section */}
      <Featured />

      {/* 4. Categories Section (Bento Grid Layout trên Desktop) */}
      <section id="collections" className="bg-muted/20 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="text-[clamp(1.875rem,4vw,2.5rem)] font-extrabold tracking-tight text-foreground">
              Khám phá theo thể loại
            </h2>
            <Link
              to="/products"
              className="hidden items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground md:flex"
            >
              Tất cả <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Thiết kế trên Mobile (Hệ lưới Grid 2 cột đơn giản) */}
          <div className="grid grid-cols-2 gap-3 lg:hidden">
            {mobileCats.map((cat) => (
              <Link
                key={cat.name}
                to={cat.href}
                aria-label={`${cat.name} — ${cat.count}`}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <h3 className="text-base font-extrabold text-white">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-white/70">{cat.count}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Thiết kế Bento Grid trên Desktop (Màn hình lớn LG trở lên) */}
          <div className="hidden lg:flex lg:flex-col lg:gap-3">
            {/* Hàng Bento số 1 */}
            <div className="grid grid-cols-4 grid-rows-[280px] gap-3">
              <Link
                to="/products?category=anime"
                aria-label="Anime — 180+ bộ"
                className="group relative col-span-2 overflow-hidden rounded-2xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=560&fit=crop"
                  alt="Anime"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-white">
                        Anime
                      </h3>
                      <p className="text-sm text-white/70">180+ bộ</p>
                    </div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                      <ArrowRight className="h-4 w-4 text-white" />
                    </span>
                  </div>
                </div>
              </Link>

              {[
                {
                  href: "/products?category=game",
                  label: "Game — 120+ bộ",
                  src: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&h=560&fit=crop",
                  name: "Game",
                  count: "120+ bộ",
                },
                {
                  href: "/products?category=movie",
                  label: "Phim & Series — 90+ bộ",
                  src: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&h=560&fit=crop",
                  name: "Phim & Series",
                  count: "90+ bộ",
                },
              ].map((c) => (
                <Link
                  key={c.href}
                  to={c.href}
                  aria-label={c.label}
                  className="group relative col-span-1 overflow-hidden rounded-2xl"
                >
                  <img
                    src={c.src}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="text-lg font-extrabold text-white">
                          {c.name}
                        </h3>
                        <p className="text-sm text-white/70">{c.count}</p>
                      </div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                        <ArrowRight className="h-4 w-4 text-white" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Hàng Bento số 2 */}
            <div className="grid grid-cols-4 grid-rows-[220px] gap-3">
              <Link
                to="/products?category=fantasy"
                aria-label="Fantasy & Original — 60+ bộ"
                className="group relative col-span-2 overflow-hidden rounded-2xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=440&fit=crop"
                  alt="Fantasy & Original"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-white">
                        Fantasy & Original
                      </h3>
                      <p className="text-sm text-white/70">60+ bộ</p>
                    </div>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                      <ArrowRight className="h-4 w-4 text-white" />
                    </span>
                  </div>
                </div>
              </Link>

              {[
                {
                  href: "/products?category=accessories",
                  label: "Phụ kiện — 200+ món",
                  src: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=440&fit=crop&crop=top",
                  name: "Phụ kiện",
                  count: "200+ món",
                },
                {
                  href: "/custom-order",
                  label: "Đặt may theo yêu cầu",
                  src: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&h=440&fit=crop&crop=top",
                  name: "Đặt may",
                  count: "Theo yêu cầu",
                },
              ].map((c) => (
                <Link
                  key={c.href}
                  to={c.href}
                  aria-label={c.label}
                  className="group relative col-span-1 overflow-hidden rounded-2xl"
                >
                  <img
                    src={c.src}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="text-lg font-extrabold text-white">
                          {c.name}
                        </h3>
                        <p className="text-sm text-white/70">{c.count}</p>
                      </div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                        <ArrowRight className="h-4 w-4 text-white" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Rent Section (Lợi ích cho thuê dịch vụ) */}
      <section id="rent" className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-10 gap-y-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-6">
              <h2 className="text-[clamp(1.875rem,4vw,2.5rem)] font-extrabold tracking-tight text-foreground">
                Thuê thay vì mua, tiết kiệm thật sự
              </h2>
              <p className="max-w-[52ch] text-muted-foreground">
                Không cần bỏ ra cả triệu để mua một bộ chỉ mặc vài lần. Thuê
                trang phục chất lượng cao với giá hợp lý, phù hợp cho mọi sự
                kiện.
              </p>

              {/* Thống kê dữ liệu số lượng dịch vụ */}
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
                {[
                  { value: "500+", label: "Bộ sẵn thuê", hint: null },
                  { value: "99K", label: "Từ/ngày", hint: null },
                  {
                    value: "30%",
                    label: "Đặt cọc",
                    hint: "Hoàn lại khi trả đúng hạn",
                  },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-extrabold text-foreground">
                      {s.value}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {s.label}
                    </p>
                    {s.hint && (
                      <p className="mt-0.5 text-[10px] text-muted-foreground/60 leading-tight">
                        {s.hint}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                {[
                  "Thuê theo ngày, tuần hoặc tháng",
                  "Vệ sinh, kiểm tra trước khi giao",
                  "Hỗ trợ đổi size nếu không vừa",
                  "Giao nhận tận nơi tại TP.HCM & Hà Nội",
                ].map((b) => (
                  <li key={b} className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>

              <Link
                to="/products?filter=rent"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:brightness-110"
              >
                Xem trang phục cho thuê <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Khối Grid hiển thị sản phẩm cho thuê phía bên phải */}
            <div className="grid grid-cols-2 gap-3">
              {rentalItems.map((item) => (
                <div
                  key={item.name}
                  className="relative aspect-[3/4] overflow-hidden rounded-xl group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-104"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute right-3 bottom-3 left-3">
                    <p className="text-xs font-medium text-white/70">
                      {item.series}
                    </p>
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <p className="mt-0.5 text-xs font-semibold text-primary">
                      {formatPrice(item.price)}/ngày
                    </p>
                  </div>
                  {!item.available && (
                    <span className="absolute top-3 right-3 rounded-full bg-secondary/90 px-2.5 py-0.5 text-xs font-medium text-secondary-foreground backdrop-blur-xs">
                      Đã thuê
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Custom Order Section (Quy trình đặt may đồ phục chế) */}
      <section id="custom" className="bg-muted/20 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-[clamp(1.875rem,4vw,2.5rem)] font-extrabold tracking-tight text-foreground">
                Không tìm được? Chúng tôi may cho bạn
              </h2>
              <p className="mt-3 text-muted-foreground">
                Từ anime, game đến original design — theo đúng số đo và thiết kế
                bạn muốn.
              </p>
            </div>
            <Link
              to="/custom-order"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:brightness-110"
            >
              Đặt may ngay <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative">
            {/* Đường line ngang nối các bước trên Desktop */}
            <div className="absolute top-6 right-0 left-0 hidden h-px bg-border md:block" />

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
              {customOrderSteps.map((step) => (
                <div key={step.number} className="relative flex flex-col gap-4">
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background">
                    <span className="text-sm font-extrabold text-foreground">
                      {step.number}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-border">
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {[
                "Thợ may chuyên nghiệp 10+ năm kinh nghiệm",
                "Cập nhật tiến độ qua Zalo mỗi ngày",
                "Hoàn tiền nếu không đúng yêu cầu",
                "Giao toàn quốc, đóng gói cẩn thận",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Social Proof Section (Đánh giá từ cộng đồng Cosplayer) */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-[clamp(1.875rem,4vw,2.5rem)] font-extrabold tracking-tight text-foreground">
                  10.000+ khách hàng đã tin tưởng
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Cosplayer khắp Việt Nam — mua, thuê, đặt may.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 bg-muted/40 px-4 py-2 rounded-2xl border border-border/50">
                <StarRating rating={5} size="md" />
                <span className="text-lg font-extrabold text-foreground">
                  4.9
                </span>
                <span className="text-sm text-muted-foreground">
                  / 5 · 2.400+ đánh giá
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {/* Đánh giá lớn nổi bật bên trái */}
            <div className="flex flex-col justify-between gap-6 rounded-2xl bg-foreground p-8 text-background lg:row-span-2">
              <div className="flex flex-col gap-4">
                <StarRating rating={reviews[0].rating} size="md" />
                <p className="text-xl leading-relaxed font-medium text-background/95">
                  &ldquo;{reviews[0].comment}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-background/10 pt-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background/20 font-bold text-background text-sm">
                  {reviews[0].initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-background">
                    {reviews[0].name}
                  </p>
                  <p className="text-xs text-background/60">
                    {reviews[0].service}
                  </p>
                </div>
              </div>
            </div>

            {/* Lưới các đánh giá nhỏ bên phải */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
              {reviews.slice(1).map((review) => (
                <div
                  key={review.name}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-border/60 bg-muted/20 p-5"
                >
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                        {review.initials}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          {review.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {review.service}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                </div>
              ))}
            </div>

            {/* Khối chân trang điểm số kênh phân phối tích hợp dưới */}
            <div className="flex items-center gap-6 flex-wrap rounded-2xl border border-border/60 px-6 py-4 lg:col-span-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Được đánh giá trên
              </p>
              <div className="flex items-center gap-6 flex-wrap">
                {[
                  { name: "Google", score: "4.9" },
                  { name: "Facebook", score: "4.8" },
                  { name: "Shopee", score: "4.9" },
                ].map((p) => (
                  <div key={p.name} className="flex items-baseline gap-1">
                    <span className="text-base font-extrabold text-foreground">
                      {p.score}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {p.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Newsletter Section */}
      <Newsletter />
    </main>
  );
};
