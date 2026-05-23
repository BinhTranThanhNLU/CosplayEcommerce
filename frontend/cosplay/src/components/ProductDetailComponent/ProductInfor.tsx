// ProductInfo.tsx
import { useState } from "react";
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

type ProductInfoProps = {
  product: Product;
};

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const [mode, setMode] = useState<"buy" | "rent">("buy");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [rentDays, setRentDays] = useState(3);

  const salePrices =
    product.variants?.map((variant) => variant.salePrice).filter((price) => price > 0) ?? [];
  const rentPrices =
    product.variants?.map((variant) => variant.rentPrice).filter((price) => price > 0) ?? [];

  const buyPrice = product.price ?? salePrices[0] ?? 0;
  const rentPrice = product.rentPrice ?? rentPrices[0] ?? 0;
  const canRent = product.canRent ?? rentPrice > 0;

  const currentPrice = mode === "buy" ? buyPrice : rentPrice * rentDays;
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
      {canRent && (
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
                    ? formatPrice(product.price)
                    : `${formatPrice(product.rentPrice ?? 0)}/ngày`}
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

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-extrabold">
          {formatPrice(currentPrice)}
        </span>
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
          {(product.sizes ?? []).map((size) => (
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
          {(product.sizes?.length ?? 0) === 0 && (
            <p className="text-sm text-muted-foreground">Chưa có size khả dụng</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button className="flex items-center justify-center rounded-full bg-primary px-4 py-3 text-white transition-opacity hover:opacity-90">
          <ShoppingCart className="mr-2 size-4" />
          {mode === "buy" ? "Thêm vào giỏ hàng" : `Đặt thuê ${rentDays} ngày`}
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
