// ProductRelated.tsx
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { formatPrice } from "../utils/Format";
import type { Product } from "../../types/ProductDetailType";

type ProductRelatedProps = {
  products: Product[];
};

export const ProductRelated = ({ products }: ProductRelatedProps) => {
  if (!products.length) return null;

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
        Có thể bạn cũng thích
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="group flex flex-col gap-3"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
              <img
                src={product.images?.[0] ?? product.imageUrl}
                alt={`Trang phục ${product.name} từ ${product.series ?? product.categoryName ?? "cosplay"}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{product.series}</p>
              <h3 className="mt-0.5 font-semibold text-foreground transition-colors group-hover:text-primary">
                {product.name}
              </h3>
              <div className="mt-1 flex items-center gap-1.5">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span className="text-xs text-muted-foreground">
                  {product.rating}
                </span>
              </div>
              <p className="mt-1 text-sm font-bold text-foreground">
                {formatPrice(product.price ?? product.variants?.[0]?.salePrice ?? 0)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
