import { Link, useSearchParams } from "react-router-dom";
import { formatPrice } from "../utils/Format";
import type { ProductModel } from "../../model/ProductModel";

type ProductCardProps = {
  product: ProductModel;
};

const getPriceBounds = (product: ProductModel) => {
  const salePrices = product.variants
    .map((variant) => variant.salePrice)
    .filter((price) => price > 0);

  const rentPrices = product.variants
    .map((variant) => variant.rentPrice)
    .filter((price) => price > 0);

  return {
    minSalePrice: salePrices.length ? Math.min(...salePrices) : null,
    maxSalePrice: salePrices.length ? Math.max(...salePrices) : null,
    minRentPrice: rentPrices.length ? Math.min(...rentPrices) : null,
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const [searchParams] = useSearchParams();
  const currentType = searchParams.get("type")?.toUpperCase();
  const detailHref = `/products/${product.id}${currentType === "RENT" ? "?type=RENT" : ""}`;
  const rentHref = `/products/${product.id}?type=RENT`;
  const { minSalePrice, maxSalePrice, minRentPrice } = getPriceBounds(product);
  const hasRent = product.variants.some((variant) => variant.rentPrice > 0);

  if (!product) return null;

  return (
    <Link to={detailHref} className="group flex flex-col gap-2.5">
      {/* Khung chứa ảnh sản phẩm */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />

        {/* Lớp phủ Hover Overlay */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/65 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="w-full p-3">
            <div className="flex gap-1.5">
              <button
                onClick={(e) => e.preventDefault()} // Chặn click chuyển trang khi test UI
                className="flex-1 rounded-full bg-primary py-2 text-center text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Chi tiết
              </button>
              {hasRent && (
                <Link
                  to={rentHref}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 rounded-full bg-white/20 py-2 text-center text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                >
                  Thuê
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin chữ phía dưới sản phẩm */}
      <div className="flex flex-col gap-0.5">
        <p className="text-xs text-muted-foreground">{product.categoryName}</p>
        <h3 className="text-sm leading-snug font-semibold text-foreground transition-colors group-hover:text-primary line-clamp-2">
          {product.name}
        </h3>

        {/* Khu vực hiển thị giá bán */}
        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-foreground">
            {formatPrice(minSalePrice)}
          </span>
          {maxSalePrice && minSalePrice && maxSalePrice > minSalePrice && (
            <span className="text-xs text-muted-foreground line-through opacity-70">
              {formatPrice(maxSalePrice)}
            </span>
          )}
        </div>

        {/* Khu vực hiển thị giá thuê nếu có */}
        {hasRent && minRentPrice && (
          <p className="text-xs font-medium text-primary">
            Thuê từ {formatPrice(minRentPrice)}/ngày
          </p>
        )}
      </div>
    </Link>
  );
}
