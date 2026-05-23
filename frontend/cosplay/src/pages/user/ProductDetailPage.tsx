import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAllProducts, getProductById } from "../../apis/productApi";
import { ProductGallery } from "../../components/ProductDetailComponent/ProductGallery";
import { ProductRelated } from "../../components/ProductDetailComponent/ProductRelated";
import { ProductTab } from "../../components/ProductDetailComponent/ProductTabs";
import { ProductInfo } from "../../components/ProductDetailComponent/ProductInfor";
import type { Product } from "../../types/ProductDetailType";

const relatedLimit = 4;

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const productId = Number(id);

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!Number.isFinite(productId)) {
        setErrorMessage("Mã sản phẩm không hợp lệ");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);
        setNotFound(false);

        const detail = await getProductById(productId);
        setProduct(detail);

        const relatedResponse = await getAllProducts({
          categoryId: detail.categoryId,
          size: 8,
        });

        setRelatedProducts(
          relatedResponse.products
            .filter((item) => item.id !== detail.id)
            .slice(0, relatedLimit),
        );
      } catch (error: any) {
        const status = error?.response?.status;

        setProduct(null);
        setRelatedProducts([]);

        if (status === 404) {
          setNotFound(true);
        } else {
          setErrorMessage(error?.message || "Không thể tải chi tiết sản phẩm");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="px-4 py-12 text-center text-muted-foreground">
        Đang tải chi tiết sản phẩm...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="px-4 py-12 text-center text-muted-foreground">
        Không tìm thấy sản phẩm
      </div>
    );
  }

  if (errorMessage) {
    return <div className="px-4 py-12 text-center text-red-500">{errorMessage}</div>;
  }

  if (!product) {
    return (
      <div className="px-4 py-12 text-center text-muted-foreground">
        Không có dữ liệu sản phẩm
      </div>
    );
  }

  const galleryImages = [product.images?.[0] ?? product.imageUrl].filter(Boolean) as string[];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Trang chủ
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-foreground">
          Sản phẩm
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      {/* Main Content */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={galleryImages} name={product.name} />
        <ProductInfo product={product} />
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <ProductTab product={product} />
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-20">
          <ProductRelated products={relatedProducts} />
        </div>
      )}
    </main>
  );
};
