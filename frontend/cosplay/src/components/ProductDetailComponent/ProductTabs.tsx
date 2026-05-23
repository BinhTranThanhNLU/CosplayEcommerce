// ProductTabs.tsx
import { useState } from "react";
import { ProductReview } from "./ProductReview";
import type { Product } from "../../types/ProductDetailType";

type ProductTabProps = {
  product: Product;
};

export const ProductTab = ({ product }: ProductTabProps) => {
  const [activeTab, setActiveTab] = useState<
    "description" | "details" | "reviews"
  >("description");

  const details =
    product.details?.length
      ? product.details
      : [
          product.categoryName && { label: "Danh mục", value: product.categoryName },
          product.shopName && { label: "Cửa hàng", value: product.shopName },
          product.type && { label: "Hình thức", value: product.type },
          product.createdAt && {
            label: "Ngày tạo",
            value: new Date(product.createdAt).toLocaleDateString("vi-VN"),
          },
          {
            label: "Biến thể",
            value: String(product.variants?.length ?? 0),
          },
        ].filter(Boolean) as Array<{ label: string; value: string }>;

  const reviewLabel =
    (product.reviewCount ?? 0) > 0 ? `Đánh giá (${product.reviewCount})` : "Đánh giá";

  const tabs = [
    { value: "description", label: "Mô tả" },
    { value: "details", label: "Chi tiết" },
    { value: "reviews", label: reviewLabel },
  ] as const;

  return (
    <div>
      {/* Tabs header */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Description */}
      {activeTab === "description" && (
        <div className="mt-6">
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </div>
      )}

      {/* Details */}
      {activeTab === "details" && (
        <div className="mt-6 max-w-md">
          {details.map((d, i) => (
            <div
              key={d.label}
              className={`grid grid-cols-2 py-3 text-sm ${
                i < details.length - 1
                  ? "border-b border-border/60"
                  : ""
              }`}
            >
              <span className="font-medium text-foreground">{d.label}</span>
              <span className="text-muted-foreground">{d.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Reviews */}
      {activeTab === "reviews" && (
        <div className="mt-6">
          <ProductReview product={product} />
        </div>
      )}
    </div>
  );
};
