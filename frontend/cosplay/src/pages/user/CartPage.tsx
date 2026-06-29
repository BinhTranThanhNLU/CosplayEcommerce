import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Minus, Plus, Store, Trash2, Truck } from "lucide-react";
import { getCart, removeCartItem, updateCartItem, type CartResponse } from "../../apis/cartApi";
import { formatPrice } from "../../components/utils/Format";
import { getStoredAuthSession } from "../../utils/authStorage";

export const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCart = async () => {
    const session = getStoredAuthSession();
    if (!session.token) {
      navigate("/login", { state: { message: "Vui lòng đăng nhập để xem giỏ hàng." } });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await getCart();
      setCart(response);
      setSelectedIds(response.items.map((item) => item.id));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể tải giỏ hàng.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadCart();
  }, []);

  const items = cart?.items ?? [];
  const allSelected = items.length > 0 && selectedIds.length === items.length;

  const selectedItems = useMemo(() => items.filter((item) => selectedIds.includes(item.id)), [items, selectedIds]);

  const selectedTotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [selectedItems],
  );

  const selectedTypes = useMemo(() => Array.from(new Set(selectedItems.map((item) => item.itemType ?? "SELL"))), [selectedItems]);

  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? items.map((item) => item.id) : []);
  };

  const toggleItem = (itemId: number, checked: boolean) => {
    setSelectedIds((current) => (checked ? [...new Set([...current, itemId])] : current.filter((id) => id !== itemId)));
  };

  const handleQuantityChange = async (itemId: number, event: ChangeEvent<HTMLInputElement>) => {
    const quantity = Number(event.target.value);
    if (!Number.isFinite(quantity)) return;

    try {
      setError(null);
      if (quantity <= 0) {
        setCart(await removeCartItem(itemId));
        setSelectedIds((current) => current.filter((id) => id !== itemId));
      } else {
        setCart(await updateCartItem(itemId, quantity));
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể cập nhật số lượng.");
    }
  };

  const handleQuantityDelta = async (itemId: number, quantity: number, delta: number, stock: number) => {
    const nextQuantity = Math.max(0, Math.min(stock, quantity + delta));
    try {
      setError(null);
      if (nextQuantity <= 0) {
        setCart(await removeCartItem(itemId));
        setSelectedIds((current) => current.filter((id) => id !== itemId));
      } else {
        setCart(await updateCartItem(itemId, nextQuantity));
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể cập nhật số lượng.");
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      setError(null);
      setCart(await removeCartItem(itemId));
      setSelectedIds((current) => current.filter((id) => id !== itemId));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không thể xóa sản phẩm.");
    }
  };

  const goToCheckout = () => {
    if (selectedIds.length === 0) {
      setError("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }

    if (selectedTypes.length > 1) {
      setError("Vui lòng thanh toán đơn mua và đơn thuê riêng.");
      return;
    }

    navigate("/checkout", { state: { selectedIds } });
  };

  if (isLoading) {
    return <div className="px-4 py-12 text-center text-muted-foreground">Đang tải giỏ hàng...</div>;
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-6 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 grid grid-cols-[42px_minmax(300px,1fr)_105px_135px_135px_145px_120px] items-center rounded-sm bg-white px-6 py-4 text-sm text-[#888] shadow-sm">
          <input type="checkbox" checked={allSelected} onChange={(event) => toggleAll(event.target.checked)} className="h-5 w-5 accent-[#ee4d2d]" />
          <span>Sản Phẩm</span>
          <span className="text-center">Loại</span>
          <span className="text-center">Đơn Giá</span>
          <span className="text-center">Số Lượng</span>
          <span className="text-center">Số Tiền</span>
          <span className="text-center">Thao Tác</span>
        </div>

        {error && <div className="mb-4 rounded-sm border border-red-200 bg-white px-4 py-3 text-sm text-red-600 shadow-sm">{error}</div>}

        {items.length === 0 ? (
          <div className="rounded-sm bg-white p-12 text-center shadow-sm">
            <p className="text-[#777]">Giỏ hàng đang trống.</p>
            <Link to="/products" className="mt-4 inline-flex bg-[#ee4d2d] px-8 py-3 text-sm font-semibold text-white hover:bg-[#d73211]">
              Xem sản phẩm
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <section className="overflow-hidden rounded-sm bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-[#f0f0f0] px-6 py-5 text-sm font-medium text-[#333]">
                <input type="checkbox" checked={allSelected} onChange={(event) => toggleAll(event.target.checked)} className="h-5 w-5 accent-[#ee4d2d]" />
                <Store className="h-5 w-5 text-[#555]" />
                <span>COSPLAY SHOP</span>
                <span className="rounded-sm bg-[#ee4d2d] px-1.5 py-0.5 text-xs text-white">Yêu thích</span>
              </div>

              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[42px_minmax(300px,1fr)_105px_135px_135px_145px_120px] items-center border-b border-[#f0f0f0] px-6 py-7 text-sm last:border-b-0">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={(event) => toggleItem(item.id, event.target.checked)}
                    className="h-5 w-5 accent-[#ee4d2d]"
                  />

                  <div className="flex min-w-0 items-center gap-4">
                    <Link to={`/products/${item.productId}`} className="h-24 w-24 flex-shrink-0 overflow-hidden border border-[#eee] bg-[#fafafa]">
                      <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                    </Link>
                    <div className="min-w-0">
                      <Link to={`/products/${item.productId}`} className="line-clamp-2 text-[#222] hover:text-[#ee4d2d]">
                        {item.productName}
                      </Link>
                      <div className="mt-2 inline-flex rounded-sm bg-[#ee4d2d] px-2 py-0.5 text-xs font-semibold text-white">6.6</div>
                    </div>
                    <div className="ml-auto min-w-36 text-[#777]">
                      <button type="button" className="mb-1 flex items-center gap-1 hover:text-[#ee4d2d]">
                        Phân Loại Hàng: <ChevronDown className="h-4 w-4" />
                      </button>
                      <p>{item.size || "N/A"},{item.color || "N/A"}</p>
                    </div>
                  </div>

                  <div className="text-center text-[#222]">
                    <span className={item.itemType === "RENT" ? "rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700" : "rounded bg-orange-50 px-2 py-1 text-xs font-semibold text-[#ee4d2d]"}>
                      {item.itemType === "RENT" ? `Thuê ${item.rentalDays ?? 1} ngày` : "Mua"}
                    </span>
                  </div>

                  <div className="text-center text-[#222]">{formatPrice(item.price)}</div>

                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleQuantityDelta(item.id, item.quantity, -1, item.stock)}
                      className="flex h-9 w-9 items-center justify-center border border-[#e5e5e5] text-[#666] hover:bg-[#fafafa]"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={item.stock}
                      value={item.quantity}
                      onChange={(event) => handleQuantityChange(item.id, event)}
                      className="h-9 w-14 border-y border-[#e5e5e5] text-center text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityDelta(item.id, item.quantity, 1, item.stock)}
                      className="flex h-9 w-9 items-center justify-center border border-[#e5e5e5] text-[#666] hover:bg-[#fafafa]"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-center font-medium text-[#ee4d2d]">{formatPrice(item.lineTotal)}</div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#ee4d2d] hover:bg-[#ffeaea] hover:text-[#d43b2a] border border-transparent transition"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Xóa</span>
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-5 border-b border-[#f0f0f0] px-6 py-4 text-sm">
                <span className="text-[#333]">Thêm Shop Voucher</span>
                <button type="button" className="text-blue-600 hover:text-[#ee4d2d]">Xem thêm voucher</button>
              </div>

              <div className="flex items-center gap-4 px-6 py-4 text-sm text-[#333]">
                <Truck className="h-5 w-5 text-emerald-500" />
                <span>Giảm phí vận chuyển cho đơn hàng. Nhập địa chỉ để hệ thống tính phí giao hàng.</span>
                <button type="button" className="text-blue-600 hover:text-[#ee4d2d]">Tìm hiểu thêm</button>
              </div>
            </section>

            <section className="sticky bottom-0 z-10 rounded-sm bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-end gap-4 border-b border-dashed border-[#e8e8e8] px-8 py-4 text-sm">
              </div>

              <div className="grid gap-3 px-8 py-4 md:grid-cols-[1fr_360px]">
                <div className="flex items-center gap-5 text-sm">
                  <label className="flex items-center gap-3 text-[#333]">
                    <input type="checkbox" checked={allSelected} onChange={(event) => toggleAll(event.target.checked)} className="h-5 w-5 accent-[#ee4d2d]" />
                    Chọn Tất Cả ({items.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => selectedIds.forEach((id) => handleRemove(id))}
                    className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#333] hover:bg-[#fff1f0] hover:text-[#ee4d2d] border border-[#f3c2bf] transition"
                  >
                    <Trash2 className="h-4 w-4 text-[#ee4d2d]" />
                    <span>Xóa</span>
                  </button>
                  <button type="button" className="text-[#ee4d2d]">Lưu vào mục Đã thích</button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-end gap-5">
                    <div className="text-right">
                      <span className="text-sm text-[#333]">Tổng cộng ({selectedIds.length} sản phẩm): </span>
                      <span className="text-2xl font-medium text-[#ee4d2d]">{formatPrice(selectedTotal)}</span>
                    </div>
                    <button type="button" onClick={goToCheckout} className="min-w-56 bg-[#ee4d2d] px-10 py-3 text-sm font-semibold text-white hover:bg-[#d73211]">
                      Thanh toán
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
};
