import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import { getCart } from "../../apis/cartApi";
import {
  loadVietnamAddressData,
  type VietnamProvince,
} from "../../data/vietnamAddress";
import { getStoredAuthSession } from "../../utils/authStorage";
import type { CartResponse } from "../../responsemodel/CartReponse";
import { checkoutCart } from "../../apis/orderApi";
import { AddressSection } from "../../components/CheckoutComponent/AddressSection";
import { OrderSummarySection } from "../../components/CheckoutComponent/OrderSummarySection";
import { PaymentMethodSection } from "../../components/CheckoutComponent/PaymentMethodSection";
import { ProductListSection } from "../../components/CheckoutComponent/ProductListSection";
import { ShippingNoteSection } from "../../components/CheckoutComponent/ShippingNoteSection";


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
      navigate("/login", {
        state: { message: "Vui lòng đăng nhập để thanh toán." },
      });
      return;
    }
    const loadCart = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setCart(await getCart());
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Không thể tải thông tin thanh toán.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, [navigate]);

  const selectedProvince = useMemo(
    () => addressData.find((item) => String(item.code) === provinceCode),
    [addressData, provinceCode],
  );
  const districts = selectedProvince?.districts ?? [];
  const selectedDistrict = useMemo(
    () => districts.find((item) => String(item.code) === districtCode),
    [districts, districtCode],
  );
  const wards = selectedDistrict?.wards ?? [];
  const selectedWard = useMemo(
    () => wards.find((item) => String(item.code) === wardCode),
    [wards, wardCode],
  );

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

  const subtotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [selectedItems],
  );
  const finalTotal = Math.max(0, subtotal + shippingFee);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (selectedItems.length === 0) {
      setError("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }

    const normalizedPhone = phoneNumber.replace(/\s/g, "");
    if (
      !recipientName.trim() ||
      !normalizedPhone ||
      !provinceCode ||
      !districtCode ||
      !wardCode ||
      !detailAddress.trim()
    ) {
      setError(
        "Vui lòng nhập đầy đủ họ tên, số điện thoại, tỉnh/thành, quận/huyện, phường/xã và địa chỉ chi tiết.",
      );
      return;
    }

    if (!vietnamPhoneRegex.test(normalizedPhone)) {
      setError(
        "Số điện thoại không hợp lệ. Vui lòng nhập số Việt Nam, ví dụ: 0901234567 hoặc +84901234567.",
      );
      return;
    }

    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      setError(
        "Vui lòng chọn địa chỉ theo đúng danh sách Tỉnh/Thành phố, Quận/Huyện và Phường/Xã tại Việt Nam.",
      );
      return;
    }

    if (detailAddress.trim().length < 5) {
      setError(
        "Địa chỉ chi tiết cần rõ số nhà/tên đường hoặc mô tả nơi nhận hàng.",
      );
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

      const response = await checkoutCart(fullAddress, paymentMethod);

      if (response.paymentUrl && response.paymentUrl.trim() !== "") {
        window.location.href = response.paymentUrl;
        return;
      }

      setSuccessMessage(
        `Đặt hàng thành công. Mã đơn hàng: #${response.orderId}`,
      );
      window.setTimeout(() => navigate("/cart"), 1200);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Không thể tạo đơn hàng. Vui lòng thử lại.",
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 py-16 text-center text-muted-foreground">
        Đang tải trang thanh toán...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f6f6] px-4 py-8 md:px-6">
      <form onSubmit={handleSubmit} className="mx-auto max-w-7xl space-y-5">
        <div className="flex items-center justify-between rounded-2xl bg-white px-6 py-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-[#ee4d2d]">COSPLAY SHOP</p>
            <h1 className="mt-1 text-2xl font-bold text-[#222]">
              Thanh toán đơn hàng
            </h1>
          </div>
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-[#f2c9c0] px-4 py-2 text-sm font-semibold text-[#ee4d2d] hover:bg-[#fff1ed]"
          >
            <ChevronLeft className="h-4 w-4" /> Quay lại giỏ hàng
          </Link>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-white px-5 py-4 text-sm font-medium text-red-600 shadow-sm">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-5 py-4 text-sm font-medium text-emerald-600 shadow-sm">
            <CheckCircle2 className="h-5 w-5" /> {successMessage}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[1fr_390px]">
          <div className="space-y-5">
            <AddressSection
              recipientName={recipientName}
              setRecipientName={setRecipientName}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              provinceCode={provinceCode}
              handleProvinceChange={handleProvinceChange}
              districtCode={districtCode}
              handleDistrictChange={handleDistrictChange}
              wardCode={wardCode}
              setWardCode={setWardCode}
              detailAddress={detailAddress}
              setDetailAddress={setDetailAddress}
              addressData={addressData}
              isAddressLoading={isAddressLoading}
              districts={districts}
              wards={wards}
            />

            <ProductListSection selectedItems={selectedItems} />

            <ShippingNoteSection
              note={note}
              setNote={setNote}
              shippingFee={shippingFee}
            />
          </div>

          <aside className="h-fit space-y-5 lg:sticky lg:top-6">
            <PaymentMethodSection
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />

            <OrderSummarySection
              subtotal={subtotal}
              shippingFee={shippingFee}
              finalTotal={finalTotal}
              isCheckingOut={isCheckingOut}
              isCartEmpty={selectedItems.length === 0}
            />
          </aside>
        </div>
      </form>
    </main>
  );
};
