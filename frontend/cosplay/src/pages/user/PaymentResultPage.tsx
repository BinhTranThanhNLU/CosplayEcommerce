import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Home, ShoppingBag } from "lucide-react";

export const PaymentResultPage = () => {
  // Dùng useSearchParams để lấy param từ URL
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");
  const message = searchParams.get("message");

  const isSuccess = status === "success";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f6f6] px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        {isSuccess ? (
          <>
            <CheckCircle2 className="mx-auto h-20 w-20 text-emerald-500" />
            <h1 className="mt-6 text-2xl font-bold text-[#222]">
              Thanh toán thành công!
            </h1>
            <p className="mt-2 text-[#777]">
              Cảm ơn bạn đã mua sắm. Đơn hàng{" "}
              <span className="font-semibold text-[#222]">#{orderId}</span> của
              bạn đang được xử lý.
            </p>
          </>
        ) : (
          <>
            <XCircle className="mx-auto h-20 w-20 text-red-500" />
            <h1 className="mt-6 text-2xl font-bold text-[#222]">
              Thanh toán thất bại
            </h1>
            <p className="mt-2 text-[#777]">
              {message === "Invalid-Signature"
                ? "Lỗi xác thực bảo mật VNPAY."
                : "Giao dịch bị hủy hoặc xảy ra lỗi trong quá trình thanh toán."}
            </p>
            {orderId && (
              <p className="mt-1 text-sm text-[#777]">
                Mã đơn hàng: #{orderId}
              </p>
            )}
          </>
        )}

        <div className="mt-8 flex flex-col gap-3">
          {/* Nút xem đơn hàng (bạn đổi link /orders cho phù hợp với route của bạn) */}
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#ee4d2d] px-6 py-3 font-semibold text-white transition hover:bg-[#d73211]"
          >
            <ShoppingBag className="h-5 w-5" />
            Xem lịch sử đơn hàng
          </Link>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-[#e8e8e8] px-6 py-3 font-semibold text-[#555] transition hover:bg-[#fafafa]"
          >
            <Home className="h-5 w-5" />
            Về trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
};
