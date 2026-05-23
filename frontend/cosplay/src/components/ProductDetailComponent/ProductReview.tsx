import { useState } from "react";
import { Star, MessageSquare, Plus } from "lucide-react";
import type { Product } from "../../types/ProductDetailType";

type ProductReviewProps = {
  product: Product;
};

export const ProductReview = ({ product }: ProductReviewProps) => {
  const [showWriteReview, setShowWriteReview] = useState(false);
  const totalReviews = product.reviewCount ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Đánh giá sản phẩm
          </h2>

          <p className="mt-1 text-muted-foreground">
            {totalReviews} đánh giá
          </p>
        </div>

        <button
          onClick={() => setShowWriteReview(!showWriteReview)}
          className="flex items-center rounded-full border px-4 py-2 text-sm"
        >
          {showWriteReview ? (
            <>
              <MessageSquare className="mr-2 size-4" />
              Hủy
            </>
          ) : (
            <>
              <Plus className="mr-2 size-4" />
              Viết đánh giá
            </>
          )}
        </button>
      </div>

      {/* Rating overview */}
      <div className="rounded-xl border p-6 text-sm text-muted-foreground">
        Chưa có dữ liệu đánh giá từ backend.
      </div>

      {/* Write review */}
      {showWriteReview && (
        <div className="rounded-xl border p-6">
          <p className="font-medium">
            Form viết đánh giá cho:
            {product.name}
          </p>
        </div>
      )}

      <div className="rounded-xl border p-8 text-center">
        <MessageSquare className="mx-auto mb-4 size-12 text-muted-foreground/50" />

        <h3 className="mb-2 text-lg font-semibold">Chưa có đánh giá nào</h3>

        <p className="mb-4 text-muted-foreground">
          Hãy là người đầu tiên đánh giá sản phẩm này
        </p>

        <button
          onClick={() => setShowWriteReview(true)}
          className="inline-flex items-center rounded-full border px-4 py-2 text-sm"
        >
          <Plus className="mr-2 size-4" />
          Viết đánh giá đầu tiên
        </button>
      </div>
    </div>
  );
};
