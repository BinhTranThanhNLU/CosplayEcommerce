import { useState, useEffect } from "react";
import { Star, MessageSquare, Plus, Send } from "lucide-react";
import type { Product } from "../../types/ProductDetailType";

type ProductReviewProps = {
  product: Product;
};

// Kiểu dữ liệu map với ReviewResponse từ Backend
type Review = {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export const ProductReview = ({ product }: ProductReviewProps) => {
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State cho form đánh giá
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State danh sách review lấy từ Backend
  const [reviews, setReviews] = useState<Review[]>([]);

  const totalReviews =
    reviews.length > 0 ? reviews.length : (product.reviewCount ?? 0);

  // ─── GỌI API LẤY DANH SÁCH ĐÁNH GIÁ ───────────────────────────────────────
  const fetchReviews = async () => {
    if (!product.id) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8080/reviews/product/${product.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        console.error("Lỗi khi lấy danh sách đánh giá");
      }
    } catch (error) {
      console.error("Lỗi kết nối server:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product.id]);

  // ─── XỬ LÝ SUBMIT ĐÁNH GIÁ MỚI ──────────────────────────────────────────
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !product.id) return;

    try {
      setIsSubmitting(true);

      // Lấy token từ localStorage (nếu bạn lưu tên khác thì sửa lại nhé)
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:8080/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Gửi token để Backend biết ai đang đánh giá
        },
        body: JSON.stringify({
          productId: product.id,
          rating: rating,
          comment: comment,
        }),
      });

      if (response.ok) {
        const newReview = await response.json();

        // Thêm review mới vào đầu danh sách để hiển thị ngay lập tức
        setReviews([newReview, ...reviews]);

        // Reset form
        setComment("");
        setRating(5);
        setShowWriteReview(false);
      } else {
        alert(
          "Có lỗi xảy ra khi gửi đánh giá! Vui lòng kiểm tra lại đăng nhập.",
        );
      }
    } catch (error) {
      console.error("Lỗi kết nối server:", error);
      alert("Không thể kết nối đến server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Đánh giá sản phẩm
          </h2>
          <p className="mt-1 text-muted-foreground">{totalReviews} đánh giá</p>
        </div>

        <button
          onClick={() => setShowWriteReview(!showWriteReview)}
          className="flex items-center rounded-full border px-4 py-2 text-sm transition-colors hover:bg-gray-50"
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

      {/* Form Write review */}
      {showWriteReview && (
        <form
          onSubmit={handleSubmitReview}
          className="rounded-xl border p-6 bg-gray-50/50"
        >
          <p className="mb-4 font-medium">
            Đánh giá của bạn về:{" "}
            <span className="font-semibold text-blue-600">{product.name}</span>
          </p>

          <div className="space-y-4">
            {/* Chọn số sao */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Chất lượng sản phẩm
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`size-8 cursor-pointer transition-colors ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            {/* Nhập nội dung */}
            <div>
              <label
                htmlFor="comment"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Nội dung đánh giá
              </label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này nhé..."
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Nút Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!comment.trim() || isSubmitting}
                className="flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300"
              >
                <Send className="mr-2 size-4" />
                {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Danh sách reviews */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">
          Đang tải đánh giá...
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((rv) => {
            // Format lại thời gian trả về từ BE cho đẹp
            const formattedDate = new Date(rv.createdAt).toLocaleDateString(
              "vi-VN",
              {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              },
            );

            return (
              <div key={rv.id} className="rounded-xl border p-6">
                <div className="mb-2 flex items-center justify-between">
                  <div className="font-semibold">{rv.userName}</div>
                  <div className="text-xs text-muted-foreground">
                    {formattedDate}
                  </div>
                </div>
                <div className="mb-3 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`size-4 ${
                        star <= rv.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-700">{rv.comment}</p>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State (Khi chưa có review) */
        !showWriteReview && (
          <div className="rounded-xl border p-8 text-center">
            <MessageSquare className="mx-auto mb-4 size-12 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">Chưa có đánh giá nào</h3>
            <p className="mb-4 text-muted-foreground">
              Hãy là người đầu tiên đánh giá sản phẩm này
            </p>
            <button
              onClick={() => setShowWriteReview(true)}
              className="inline-flex items-center rounded-full border px-4 py-2 text-sm transition-colors hover:bg-gray-50"
            >
              <Plus className="mr-2 size-4" />
              Viết đánh giá đầu tiên
            </button>
          </div>
        )
      )}
    </div>
  );
};
