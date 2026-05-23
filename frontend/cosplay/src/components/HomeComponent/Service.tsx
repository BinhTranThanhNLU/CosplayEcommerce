import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import imgMua from "../../assets/img/mua.webp";
import imgThue from "../../assets/img/thue.jpg";
import imgDatMay from "../../assets/img/dat-may.jpeg";

// Khai báo mảng dữ liệu đồng bộ chính xác với nội dung trên ảnh mẫu
const services = [
  {
    label: "01 – MUA",
    title: "Sở hữu ngay",
    desc: "Đa dạng size, giao hàng 2–5 ngày toàn quốc. Đổi trả 7 ngày nếu không vừa.",
    detail: "Từ 350K",
    cta: "Xem chi tiết",
    href: "/products",
    image: imgMua,
  },
  {
    label: "02 – THUÊ",
    title: "Thuê theo ngày",
    detail: "Từ 99K/ngày",
    cta: "Xem chi tiết",
    href: "/rental/1",
    image: imgThue,
  },
  {
    label: "03 – ĐẶT MAY",
    title: "May theo số đo",
    detail: "7–14 ngày",
    cta: "Xem chi tiết",
    href: "/custom-order",
    image: imgDatMay,
  },
];

export const Service = () => {
  return (
    <section id="services" className="bg-muted/20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Phần tiêu đề phía trên */}
        <div className="mb-12">
          <p className="mb-2 text-sm font-bold tracking-[0.12em] text-primary uppercase">
            Dịch vụ
          </p>
          <h2 className="text-[clamp(1.875rem,4vw,2.5rem)] font-extrabold tracking-tight text-foreground">
            Một nơi, ba cách sở hữu
          </h2>
        </div>

        {/* Hệ thống Bento Grid (Chia làm 5 cột, khối lớn chiếm 3 cột, 2 khối nhỏ mỗi khối chiếm 2 cột) */}
        <div className="grid gap-3 lg:grid-cols-5">
          {/* Khối 01: MUA (Khối lớn nằm bên trái) */}
          <Link
            to={services[0].href}
            className="group relative flex min-h-[440px] flex-col justify-end overflow-hidden rounded-2xl p-8 lg:col-span-3 lg:row-span-2"
          >
            <img
              src={services[0].image}
              alt={services[0].title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Lớp màu đen mờ đổ từ dưới lên giúp nổi bật chữ trắng */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="relative z-10">
              <span className="mb-2 block text-xs font-bold tracking-[0.15em] text-white/60 uppercase">
                {services[0].label}
              </span>
              <h3 className="text-3xl font-extrabold text-white">
                {services[0].title}
              </h3>
              <p className="mt-2 max-w-[40ch] text-sm leading-relaxed text-white/70">
                {services[0].desc}
              </p>
              <div className="mt-5 flex items-center justify-between">
                {/* Badge màu cam thương hiệu chứa giá tiền */}
                <span className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm">
                  {services[0].detail}
                </span>
                {/* Mũi tên tương tác chỉ xuất hiện mượt mà khi hover */}
                <span className="flex items-center gap-1.5 text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {services[0].cta} <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* Các khối nhỏ nằm bên phải (02 THUÊ & 03 ĐẶT MAY) */}
          <div className="grid gap-3 lg:col-span-2">
            {services.slice(1).map((s) => (
              <Link
                key={s.label}
                to={s.href}
                className="group relative flex min-h-[214px] flex-col justify-end overflow-hidden rounded-2xl p-6"
              >
                <img
                  src={s.image}
                  alt={s.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="relative z-10">
                  <span className="mb-1 block text-[10px] font-bold tracking-[0.15em] text-white/60 uppercase">
                    {s.label}
                  </span>
                  <h3 className="text-xl font-extrabold text-white">
                    {s.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-white">
                      {s.detail}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {s.cta} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
