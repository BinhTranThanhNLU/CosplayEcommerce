import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronLeft, CreditCard, MapPin, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { checkoutCart, getCart, type CartResponse } from "../../apis/cartApi";
import { formatPrice } from "../../components/utils/Format";
import { loadVietnamAddressData, type VietnamProvince } from "../../data/vietnamAddress";
import { getStoredAuthSession } from "../../utils/authStorage";

type CheckoutState = {
  selectedIds?: number[];
};

const shippingFee = 30000;

const vietnamPhoneRegex = /^(0|\+84)(\d{9})$/;

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CheckoutState | null;

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressData, setAddressData] = useState<VietnamProvince[]>([]);
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const [provinceCode, setProvinceCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  useEffect(() => {
    let isMounted = true;

    const loadAddressData = async () => {
      try {
        setIsAddressLoading(true);
        const data = await loadVietnamAddressData();
        if (isMounted) setAddressData(data);
      } finally {
        if (isMounted) setIsAddressLoading(false);
      }
    };

    loadAddressData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const session = getStoredAuthSession();
    if (!session.token) {
      navigate("/login", { state: { message: "Vui lòng đăng nhập để thanh toán." } });
      return;
    }

    const loadCart = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setCart(await getCart());
      } catch (err: any) {
        setError(err?.response?.data?.message || "Không thể tải thông tin thanh toán.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [navigate]);

  const selectedProvince = useMemo(() => addressData.find((item) => String(item.code) === provinceCode), [addressData, provinceCode]);
  const districts = selectedProvince?.districts ?? [];
  const selectedDistrict = useMemo(() => districts.find((item) => String(item.code) === districtCode), [districts, districtCode]);
  const wards = selectedDistrict?.wards ?? [];
  const selectedWard = useMemo(() => wards.find((item) => String(item.code) === wardCode), [wards, wardCode]);

  const handleProvinceChange = (value: string) => {
    setProvinceCode(value);
    setDistrictCode("");
    setWardCode("");
  };

  const handleDistrictChange = (value: string) => {
    setDistrictCode(value);
    setWardCode("");
  };

  const selectedItems = useMemo(() => {
    const items = cart?.items ?? [];
    const selectedIds = state?.selectedIds ?? [];
    if (selectedIds.length === 0) return items;
    return items.filter((item) => selectedIds.includes(item.id));
  }, [cart, state?.selectedIds]);

  const subtotal = useMemo(() => selectedItems.reduce((sum, item) => sum + item.lineTotal, 0), [selectedItems]);
  const finalTotal = Math.max(0, subtotal + shippingFee );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (selectedItems.length === 0) {
      setError("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }

    const normalizedPhone = phoneNumber.replace(/\s/g, "");
    if (!recipientName.trim() || !normalizedPhone || !provinceCode || !districtCode || !wardCode || !detailAddress.trim()) {
      setError("Vui lòng nhập đầy đủ họ tên, số điện thoại, tỉnh/thành, quận/huyện, phường/xã và địa chỉ chi tiết.");
      return;
    }

    if (!vietnamPhoneRegex.test(normalizedPhone)) {
      setError("Số điện thoại không hợp lệ. Vui lòng nhập số Việt Nam, ví dụ: 0901234567 hoặc +84901234567.");
      return;
    }

    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      setError("Vui lòng chọn địa chỉ theo đúng danh sách Tỉnh/Thành phố, Quận/Huyện và Phường/Xã tại Việt Nam.");
      return;
    }

    if (detailAddress.trim().length < 5) {
      setError("Địa chỉ chi tiết cần rõ số nhà/tên đường hoặc mô tả nơi nhận hàng.");
      return;
    }

    try {
      setIsCheckingOut(true);
      const fullAddress = [
        `Người nhận: ${recipientName.trim()}`,
        `SĐT: ${normalizedPhone}`,
        `Địa chỉ chi tiết: ${detailAddress.trim()}`,
        `Phường/Xã: ${selectedWard.name}`,
        `Quận/Huyện: ${selectedDistrict.name}`,
        `Tỉnh/Thành phố: ${selectedProvince.name}`,
        note.trim() ? `Ghi chú: ${note.trim()}` : "",
      ]
        .filter(Boolean)
        .join(" - ");
      const response = await checkoutCart(fullAddress);
      setSuccessMessage(`Đặt hàng thành công. Mã đơn hàng: #${response.orderId}`);
      window.setTimeout(() => navigate("/cart"), 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return <div className="px-4 py-16 text-center text-muted-foreground">Đang tải trang thanh toán...</div>;
  }

  return (
    <main className="min-h-screen bg-[#f6f6f6] px-4 py-8 md:px-6">
      <form onSubmit={handleSubmit} className="mx-auto max-w-7xl space-y-5">
        <div className="flex items-center justify-between rounded-2xl bg-white px-6 py-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-[#ee4d2d]">COSPLAY SHOP</p>
            <h1 className="mt-1 text-2xl font-bold text-[#222]">Thanh toán đơn hàng</h1>
          </div>
          <Link to="/cart" className="inline-flex items-center gap-2 rounded-full border border-[#f2c9c0] px-4 py-2 text-sm font-semibold text-[#ee4d2d] hover:bg-[#fff1ed]">
            <ChevronLeft className="h-4 w-4" />
            Quay lại giỏ hàng
          </Link>
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-white px-5 py-4 text-sm font-medium text-red-600 shadow-sm">{error}</div>}
        {successMessage && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-5 py-4 text-sm font-medium text-emerald-600 shadow-sm">
            <CheckCircle2 className="h-5 w-5" />
            {successMessage}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[1fr_390px]">
          <div className="space-y-5">
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3 border-b border-dashed border-[#eee] pb-4">
                <MapPin className="h-6 w-6 text-[#ee4d2d]" />
                <div>
                  <h2 className="text-lg font-bold text-[#222]">Địa chỉ nhận hàng</h2>
                  <p className="text-sm text-[#777]">Thông tin này sẽ được lưu vào địa chỉ giao hàng của đơn.</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-[#333]">
                  Họ tên người nhận <span className="text-[#ee4d2d]">*</span>
                  <input value={recipientName} onChange={(event) => setRecipientName(event.target.value)} className="h-12 w-full rounded-xl border border-[#e8e8e8] px-4 outline-none focus:border-[#ee4d2d]" placeholder="Nguyễn Văn A" />
                </label>
                <label className="space-y-2 text-sm font-medium text-[#333]">
                  Số điện thoại Việt Nam <span className="text-[#ee4d2d]">*</span>
                  <input value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} className="h-12 w-full rounded-xl border border-[#e8e8e8] px-4 outline-none focus:border-[#ee4d2d]" placeholder="0901234567" />
                </label>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="space-y-2 text-sm font-medium text-[#333]">
                  Tỉnh / Thành phố <span className="text-[#ee4d2d]">*</span>
                  <select value={provinceCode} onChange={(event) => handleProvinceChange(event.target.value)} className="h-12 w-full rounded-xl border border-[#e8e8e8] bg-white px-4 outline-none focus:border-[#ee4d2d]" disabled={isAddressLoading}>
                    <option value="">{isAddressLoading ? "Đang tải tỉnh/thành..." : "Chọn tỉnh/thành phố"}</option>
                    {addressData.map((provinceItem) => (
                      <option key={provinceItem.code} value={provinceItem.code}>
                        {provinceItem.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium text-[#333]">
                  Quận / Huyện <span className="text-[#ee4d2d]">*</span>
                  <select value={districtCode} onChange={(event) => handleDistrictChange(event.target.value)} className="h-12 w-full rounded-xl border border-[#e8e8e8] bg-white px-4 outline-none focus:border-[#ee4d2d] disabled:bg-[#f7f7f7]" disabled={!provinceCode}>
                    <option value="">{provinceCode ? "Chọn quận/huyện" : "Chọn tỉnh/thành trước"}</option>
                    {districts.map((districtItem) => (
                      <option key={districtItem.code} value={districtItem.code}>
                        {districtItem.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium text-[#333]">
                  Phường / Xã <span className="text-[#ee4d2d]">*</span>
                  <select value={wardCode} onChange={(event) => setWardCode(event.target.value)} className="h-12 w-full rounded-xl border border-[#e8e8e8] bg-white px-4 outline-none focus:border-[#ee4d2d] disabled:bg-[#f7f7f7]" disabled={!districtCode}>
                    <option value="">{districtCode ? "Chọn phường/xã" : "Chọn quận/huyện trước"}</option>
                    {wards.map((wardItem) => (
                      <option key={wardItem.code} value={wardItem.code}>
                        {wardItem.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="mt-4 block space-y-2 text-sm font-medium text-[#333]">
                Địa chỉ chi tiết <span className="text-[#ee4d2d]">*</span>
                <textarea value={detailAddress} onChange={(event) => setDetailAddress(event.target.value)} rows={3} className="w-full rounded-xl border border-[#e8e8e8] px-4 py-3 outline-none focus:border-[#ee4d2d]" placeholder="Số nhà, tên đường, hẻm/tòa nhà/tầng/phòng. Ví dụ: 12 Nguyễn Huệ, hẻm 3, tầng 2" />
              </label>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3 border-b border-dashed border-[#eee] pb-4">
                <PackageCheck className="h-6 w-6 text-[#ee4d2d]" />
                <h2 className="text-lg font-bold text-[#222]">Sản phẩm đặt mua</h2>
              </div>

              {selectedItems.length === 0 ? (
                <div className="rounded-xl bg-[#fff7f5] p-6 text-center text-sm text-[#ee4d2d]">Không có sản phẩm nào để thanh toán.</div>
              ) : (
                <div className="space-y-4">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="grid gap-4 rounded-xl border border-[#f0f0f0] p-4 md:grid-cols-[88px_1fr_140px] md:items-center">
                      <img src={item.imageUrl} alt={item.productName} className="h-24 w-24 rounded-xl border border-[#eee] object-cover" />
                      <div className="min-w-0">
                        <Link to={`/products/${item.productId}`} className="line-clamp-2 font-semibold text-[#222] hover:text-[#ee4d2d]">
                          {item.productName}
                        </Link>
                        <p className="mt-2 text-sm text-[#777]">Phân loại: {item.size || "N/A"} / {item.color || "N/A"}</p>
                        <p className="mt-1 text-sm text-[#777]">Số lượng: x{item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#777]">Thành tiền</p>
                        <p className="mt-1 text-lg font-bold text-[#ee4d2d]">{formatPrice(item.lineTotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3 border-b border-dashed border-[#eee] pb-4">
                <Truck className="h-6 w-6 text-[#ee4d2d]" />
                <h2 className="text-lg font-bold text-[#222]">Vận chuyển & ghi chú</h2>
              </div>
              <div className="rounded-xl border border-[#f0f0f0] bg-[#fffaf8] p-4 text-sm text-[#555]">
                <div className="flex items-center justify-between font-semibold text-[#222]">
                  <span>Giao hàng tiêu chuẩn</span>
                  <span>{formatPrice(shippingFee)}</span>
                </div>
                <p className="mt-2 text-[#777]">Dự kiến giao 2-5 ngày. Shop sẽ liên hệ xác nhận trước khi gửi hàng.</p>
              </div>
              <label className="mt-4 block space-y-2 text-sm font-medium text-[#333]">
                Ghi chú cho shop
                <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={2} className="w-full rounded-xl border border-[#e8e8e8] px-4 py-3 outline-none focus:border-[#ee4d2d]" placeholder="Ví dụ: giao giờ hành chính, kiểm tra size trước khi gửi..." />
              </label>
            </section>
          </div>

          <aside className="h-fit space-y-5 lg:sticky lg:top-6">
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3 border-b border-dashed border-[#eee] pb-4">
                <CreditCard className="h-6 w-6 text-[#ee4d2d]" />
                <h2 className="text-lg font-bold text-[#222]">Phương thức thanh toán</h2>
              </div>

              <div className="space-y-3">
                <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 ${paymentMethod === "COD" ? "border-[#ee4d2d] bg-[#fff7f5]" : "border-[#eee]"}`}>
                  <span>
                    <span className="block font-semibold text-[#222]">Thanh toán khi nhận hàng</span>
                    <span className="text-sm text-[#777]">COD - phù hợp khi mua/thuê cosplay.</span>
                  </span>
                  <input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} className="h-5 w-5 accent-[#ee4d2d]" />
                </label>

                <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 ${paymentMethod === "BANK" ? "border-[#ee4d2d] bg-[#fff7f5]" : "border-[#eee]"}`}>
                  <span>
                    <span className="block font-semibold text-[#222]">Chuyển khoản ngân hàng</span>
                    <span className="text-sm text-[#777]">Shop xác nhận sau khi nhận thanh toán.</span>
                  </span>
                  <input type="radio" checked={paymentMethod === "BANK"} onChange={() => setPaymentMethod("BANK")} className="h-5 w-5 accent-[#ee4d2d]" />
                </label>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold text-[#222]">Tóm tắt thanh toán</h2>
              <div className="space-y-3 text-sm text-[#555]">
                <div className="flex justify-between"><span>Tạm tính</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span>Phí vận chuyển</span><span>{formatPrice(shippingFee)}</span></div>
              </div>
              <div className="my-5 border-t border-dashed border-[#ddd]" />
              <div className="flex items-end justify-between">
                <span className="font-semibold text-[#222]">Tổng thanh toán</span>
                <span className="text-3xl font-bold text-[#ee4d2d]">{formatPrice(finalTotal)}</span>
              </div>
              <button disabled={isCheckingOut || selectedItems.length === 0} className="mt-6 w-full rounded-xl bg-[#ee4d2d] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#ee4d2d]/20 hover:bg-[#d73211] disabled:cursor-not-allowed disabled:opacity-60">
                {isCheckingOut ? "Đang đặt hàng..." : "Đặt hàng"}
              </button>
              <div className="mt-4 flex items-center gap-2 text-xs text-[#777]">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Thông tin đơn hàng được bảo mật và chỉ dùng để giao hàng.
              </div>
            </section>
          </aside>
        </div>
      </form>
    </main>
  );
};
