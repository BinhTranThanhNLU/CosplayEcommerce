import { useEffect, useState, type FormEvent } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { FilterSidebar, type CatalogTypeFilter } from "../../components/ProductCatalogComponent/FilterSidebar";
import { Pagination } from "../../components/ProductCatalogComponent/Pagination";
import { ProductCard } from "../../components/ProductCatalogComponent/ProductCard";
import { getAllCategories } from "../../apis/categoryApi";
import { getAllProducts } from "../../apis/productApi";
import type { CategoryModel } from "../../model/CategoryModel";
import type { ProductPageResponse } from "../../responsemodel/ProductPageResponse";
import { useSearchParams } from "react-router-dom";

const pageSize = 12;

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const parseNumberParam = (value: string | null) => {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parsePageParam = (value: string | null) => {
  const parsed = Number(value ?? "1");
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
};

const parseTypeParam = (searchParams: URLSearchParams): CatalogTypeFilter => {
  const rawType = (searchParams.get("type") ?? searchParams.get("filter") ?? "all")
    .trim()
    .toLowerCase();

  if (rawType === "sell" || rawType === "mua" || rawType === "buy") {
    return "SELL";
  }

  if (rawType === "rent") {
    return "RENT";
  }

  if (rawType === "custom" || rawType === "custom_made" || rawType === "custom-made") {
    return "CUSTOM_MADE";
  }

  if (rawType === "sell".toUpperCase()) {
    return "SELL";
  }

  return "all";
};

const resolveCategoryId = (
  searchParams: URLSearchParams,
  categories: CategoryModel[],
) => {
  const rawCategoryId = parseNumberParam(searchParams.get("categoryId"));
  if (rawCategoryId !== null) {
    return rawCategoryId;
  }

  const rawCategory = searchParams.get("category");
  if (!rawCategory) {
    return null;
  }

  const normalizedCategory = normalizeText(rawCategory);
  const matchedCategory = categories.find((category) => {
    return (
      normalizeText(category.name) === normalizedCategory ||
      normalizeText(String(category.id)) === normalizedCategory
    );
  });

  return matchedCategory?.id ?? null;
};

const getResolvedSort = (searchParams: URLSearchParams) => {
  const sortBy = searchParams.get("sortBy") === "price" ? "price" : "newest";
  const sortDir = searchParams.get("sortDir") === "asc" ? "asc" : "desc";

  return { sortBy, sortDir };
};

export const ProductCatalogPage = () => {
  const [products, setProducts] = useState<ProductPageResponse | null>(null);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [keywordInput, setKeywordInput] = useState(searchParams.get("keyword") ?? "");
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  const keyword = searchParams.get("keyword")?.trim() ?? "";
  const { sortBy, sortDir } = getResolvedSort(searchParams);
  const selectedType = parseTypeParam(searchParams);
  const selectedCategoryId = resolveCategoryId(searchParams, categories);
  const minPrice = parseNumberParam(searchParams.get("minPrice"));
  const maxPrice = parseNumberParam(searchParams.get("maxPrice"));
  const currentPage = parsePageParam(searchParams.get("page"));

  const updateSearchParams = (
    updater: (params: URLSearchParams) => void,
    options?: { replace?: boolean },
  ) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      updater(next);
      return next;
    }, options);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setKeywordInput(keyword);
  }, [keyword]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setHttpError(null);

        const data = await getAllProducts({
          keyword: keyword || undefined,
          type: selectedType === "all" ? undefined : selectedType,
          categoryId: selectedCategoryId,
          minPrice,
          maxPrice,
          sortBy,
          sortDir,
          page: currentPage - 1,
          size: pageSize,
        });

        setProducts(data);
      } catch (error: any) {
        setHttpError(error?.message || "Error fetching products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, keyword, maxPrice, minPrice, selectedCategoryId, selectedType, sortBy, sortDir]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateSearchParams((params) => {
      const nextKeyword = keywordInput.trim();

      if (nextKeyword) {
        params.set("keyword", nextKeyword);
      } else {
        params.delete("keyword");
      }

      params.set("page", "1");
    });
  };

  const handleSortChange = (value: string) => {
    const [nextSortBy, nextSortDir] = value.split(":");

    updateSearchParams((params) => {
      params.set("sortBy", nextSortBy);
      params.set("sortDir", nextSortDir);
      params.set("page", "1");
    });
  };

  const handleTypeChange = (type: CatalogTypeFilter) => {
    updateSearchParams((params) => {
      if (type === "all") {
        params.delete("type");
      } else {
        params.set("type", type);
      }

      params.delete("filter");
      params.set("page", "1");
    });
  };

  const handleCategoryChange = (categoryId: number | null) => {
    updateSearchParams((params) => {
      if (categoryId === null) {
        params.delete("categoryId");
        params.delete("category");
      } else {
        params.set("categoryId", String(categoryId));
        params.delete("category");
      }

      params.set("page", "1");
    });
  };

  const handlePriceChange = (range: { minPrice: number | null; maxPrice: number | null }) => {
    updateSearchParams((params) => {
      if (range.minPrice === null) {
        params.delete("minPrice");
      } else {
        params.set("minPrice", String(range.minPrice));
      }

      if (range.maxPrice === null) {
        params.delete("maxPrice");
      } else {
        params.set("maxPrice", String(range.maxPrice));
      }

      params.set("page", "1");
    });
  };

  const handleResetFilters = () => {
    setKeywordInput("");
    updateSearchParams((params) => {
      params.delete("keyword");
      params.delete("type");
      params.delete("filter");
      params.delete("categoryId");
      params.delete("category");
      params.delete("minPrice");
      params.delete("maxPrice");
      params.set("sortBy", "newest");
      params.set("sortDir", "desc");
      params.set("page", "1");
    });
  };

  const totalItems = products?.totalItems ?? 0;
  const totalPages = products?.totalPages ?? 0;
  const currentDisplayPage = products?.currentPage !== undefined ? products.currentPage + 1 : currentPage;

  const sortLabel =
    sortBy === "newest"
      ? "Mới nhất"
      : sortBy === "price" && sortDir === "asc"
        ? "Giá tăng dần"
        : "Giá giảm dần";

  if (isLoading && !products) {
    return <div className="px-4 py-10">Đang tải...</div>;
  }

  if (httpError) {
    return <div className="px-4 py-10 text-red-500">{httpError}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <div className="mb-8">
        <h1 className="text-[clamp(1.75rem,3.5vw,2.25rem)] font-extrabold tracking-tight text-foreground">
          Trang phục Cosplay
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mua hoặc thuê trang phục chất lượng cao từ cộng đồng cosplay Việt Nam
        </p>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-24">
            <FilterSidebar
              categories={categories}
              resultCount={totalItems}
              selectedType={selectedType}
              selectedCategoryId={selectedCategoryId}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onTypeChange={handleTypeChange}
              onCategoryChange={handleCategoryChange}
              onPriceChange={handlePriceChange}
              onReset={handleResetFilters}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <form
            onSubmit={handleSearchSubmit}
            className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={keywordInput}
                onChange={(event) => setKeywordInput(event.target.value)}
                placeholder="Tìm theo tên, danh mục, cửa hàng..."
                className="h-10 w-full rounded-full border border-border bg-background pr-9 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Bộ lọc
            </button>

            <div className="flex items-center gap-2 shrink-0">
              <label className="sr-only" htmlFor="catalog-sort">
                Sắp xếp
              </label>
              <select
                id="catalog-sort"
                value={`${sortBy}:${sortDir}`}
                onChange={(event) => handleSortChange(event.target.value)}
                className="h-10 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:border-primary focus:outline-none"
              >
                <option value="newest:desc">Mới nhất</option>
                <option value="price:asc">Giá tăng dần</option>
                <option value="price:desc">Giá giảm dần</option>
              </select>

              <button
                type="submit"
                className="hidden rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:inline-flex"
              >
                Tìm
              </button>
            </div>
          </form>

          <p className="mb-5 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{totalItems}</span> sản phẩm
            <span> · Trang {currentDisplayPage}</span>
            <span> · {sortLabel}</span>
          </p>

          {!isLoading && totalItems === 0 && (
            <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center">
              <p className="text-base font-semibold text-foreground">Không tìm thấy sản phẩm phù hợp</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Hãy thử bỏ bớt điều kiện lọc hoặc sửa từ khóa tìm kiếm.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
            {products?.products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage - 1}
              totalPages={totalPages}
              onPageChange={(page) => {
                updateSearchParams((params) => {
                  params.set("page", String(page + 1));
                });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};