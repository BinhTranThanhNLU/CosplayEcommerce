// ProductInfo.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  RotateCcw,
  Shield,
} from "lucide-react";
import { formatPrice } from "../utils/Format";
import type { Product } from "../../types/ProductDetailType";
import { addToCart } from "../../apis/cartApi";
import { getStoredAuthSession } from "../../utils/authStorage";

type ProductInfoProps = {
  product: Product;
  detailMode?: "buy" | "rent";
};

export const ProductInfo = ({ product, detailMode }: ProductInfoProps) => {
  const isRentDetail = detailMode === "rent";
  const [mode, setMode] = useState<"buy" | "rent">(isRentDetail ? "rent" : "buy");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [rentDays, setRentDays] = useState(3);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const salePrices =
    product.variants?.map((variant) => variant.salePrice).filter((price) => price > 0) ?? [];
  const rentPrices =
    product.variants?.map((variant) => variant.rentPrice).filter((price) => price > 0) ?? [];

  const buyPrice = product.price ?? salePrices[0] ?? 0;
  const rentPrice = product.rentPrice ?? rentPrices[0] ?? 0;
  const canRent = product.canRent ?? rentPrice > 0;

  const sizes = useMemo(() => {
    const variantSizes = product.variants?.map((variant) => variant.size).filter(Boolean) ?? [];
    return product.sizes?.length ? product.sizes : Array.from(new Set(variantSizes));
  }, [product.sizes, product.variants]);

  const selectedVariant = useMemo(() => {
    if (!product.variants?.length) {
      return null;
    }

    if (selectedSize) {
      return product.variants.find((variant) => variant.size === selectedSize) ?? product.variants[0];
    }

    return product.variants[0];
  }, [product.variants, selectedSize]);

  const currentRentPrice = selectedVariant?.rentPrice ?? rentPrice;
  const unitPrice = mode === "buy" ? (selectedVariant?.salePrice ?? buyPrice) : currentRentPrice * rentDays;
  const currentPrice = unitPrice * quantity;
  const discountPct = product.originalPrice && buyPrice > 0
    ? Math.round((1 - buyPrice / product.originalPrice) * 100)
    : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {product.series && (
            <span className="text-sm font-medium text-muted-foreground">
              {product.series}
            </span>
          )}
          {product.badge && (
            <span className="rounded bg-primary px-2 py-1 text-xs text-white">
              {product.badge}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
          {product.name}
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-4 ${
                  i < Math.floor(product.rating ?? 0)
                    ? "fill-amber-400 text-amber-400"
                    : "text-border"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-foreground">
            {product.rating ?? 0}
          </span>
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount ?? 0} đánh giá)
          </span>
        </div>
      </div>

      <hr />

      {/* Mode Select */}
      {canRent && !isRentDetail && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-foreground">Hình thức</p>
          <div className="flex gap-2">
            {(["buy", "rent"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                  mode === m
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                <div className="text-base font-bold">
                  {m === "buy"
                    ? formatPrice(selectedVariant?.salePrice ?? buyPrice)
                    : `${formatPrice(currentRentPrice)}/ngày`}
                </div>
                <div className="text-xs opacity-70">
                  {m === "buy" ? "Mua trực tiếp" : "Thuê trang phục"}
                </div>
              </button>
            ))}
          </div>

          {/* Rent Days Select */}
          {mode === "rent" && (
            <div className="flex flex-col gap-2 rounded-xl bg-muted/50 p-4">
              <p className="text-sm font-medium">Số ngày thuê</p>
              <div className="flex gap-2">
                {[1, 3, 7, 14].map((d) => (
                  <button
                    key={d}
                    onClick={() => setRentDays(d)}
                    className={`rounded-lg border px-3 py-1.5 text-sm ${
                      rentDays === d
                        ? "border-primary bg-primary text-white"
                        : "border-border"
                    }`}
                  >
                    {d} ngày
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Đặt cọc 30% ({formatPrice(currentPrice * 0.3)})
              </p>
            </div>
          )}
        </div>
      )}

      {isRentDetail && (
        <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-semibold text-primary">Thuê trang phục</p>
          <div className="flex flex-col gap-2 rounded-xl bg-white/70 p-4">
            <p className="text-sm font-medium">Số ngày thuê</p>
            <div className="flex gap-2">
              {[1, 3, 7, 14].map((d) => (
                <button
                  key={d}
                  onClick={() => setRentDays(d)}
                  className={`rounded-lg border px-3 py-1.5 text-sm ${
                    rentDays === d
                      ? "border-primary bg-primary text-white"
                      : "border-border"
                  }`}
                >
                  {d} ngày
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Giá thuê: {formatPrice(currentRentPrice)}/ngày x {rentDays} ngày x {quantity} sản phẩm
            </p>
            <p className="text-xs text-muted-foreground">
              Đặt cọc 30% ({formatPrice(currentPrice * 0.3)})
            </p>
          </div>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">{mode === "rent" ? "Tổng tiền thuê" : "Tổng tiền"}</span>
          <span className="text-3xl font-extrabold">
            {formatPrice(currentPrice)}
          </span>
        </div>
        {mode === "buy" && product.originalPrice && (
          <>
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
            {discountPct && (
              <span className="rounded bg-secondary px-2 py-1 text-xs">
                -{discountPct}%
              </span>
            )}
          </>
        )}
      </div>

      {/* Sizes */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Chọn size</p>
          <a
            href="/size-guide"
            className="text-xs text-primary hover:underline"
          >
            Hướng dẫn chọn size
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`min-w-[3rem] rounded-lg border px-3 py-2 text-sm ${
                selectedSize === size
                  ? "border-primary bg-primary text-white"
                  : "border-border"
              }`}
            >
              {size}
            </button>
          ))}
          {sizes.length === 0 && (
            <p className="text-sm text-muted-foreground">Chưa có size khả dụng</p>
          )}
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-3">
        <p className="text-sm font-medium">Số lượng</p>
        <div className="flex items-center overflow-hidden rounded-full border border-border">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="h-9 w-10 text-lg hover:bg-muted"
          >
            -
          </button>
          <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((value) => value + 1)}
            className="h-9 w-10 text-lg hover:bg-muted"
          >
            +
          </button>
        </div>
      </div>

      {message && <p className="text-sm font-medium text-primary">{message}</p>}
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button
          disabled={isAdding || !selectedVariant}
          onClick={async () => {
            setMessage(null);
            setError(null);

            const session = getStoredAuthSession();
            if (!session.token) {
              navigate("/login", { state: { message: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng." } });
              return;
            }

            if (!selectedVariant) {
              setError("Vui lòng chọn phân loại sản phẩm.");
              return;
            }

            try {
              setIsAdding(true);
              await addToCart(selectedVariant.id, quantity, mode === "rent" ? "RENT" : "SELL", mode === "rent" ? rentDays : undefined);
              setMessage(mode === "rent" ? "Đã thêm đơn thuê vào giỏ hàng." : "Đã thêm vào giỏ hàng.");
            } catch (err: any) {
              setError(err?.response?.data?.message || "Không thể thêm vào giỏ hàng.");
            } finally {
              setIsAdding(false);
            }
          }}
          className="flex items-center justify-center rounded-full bg-primary px-4 py-3 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ShoppingCart className="mr-2 size-4" />
          {isAdding ? "Đang thêm..." : mode === "buy" ? "Thêm vào giỏ hàng" : `Đặt thuê ${rentDays} ngày`}
        </button>
        <button className="flex items-center justify-center rounded-full border px-4 py-3 transition-colors hover:bg-muted">
          <Heart className="mr-2 size-4" />
          Lưu vào yêu thích
        </button>
      </div>

      {/* Trust */}
      <div className="flex flex-col gap-2 rounded-xl bg-muted/50 p-4">
        {[
          { icon: Truck, text: "Giao hàng toàn quốc 2–5 ngày" },
          { icon: RotateCcw, text: "Đổi trả 7 ngày nếu lỗi sản xuất" },
          { icon: Shield, text: "Hàng chính hãng, may thủ công" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3">
            <Icon className="size-4 text-primary" />
            <span className="text-sm text-muted-foreground">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
