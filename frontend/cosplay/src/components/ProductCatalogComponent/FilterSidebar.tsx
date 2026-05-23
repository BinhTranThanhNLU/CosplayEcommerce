import { useEffect, useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import type { CategoryModel } from "../../model/CategoryModel";

export type CatalogTypeFilter = "all" | "SELL" | "RENT" | "CUSTOM_MADE";

type FilterSidebarProps = {
  categories: CategoryModel[];
  resultCount: number;
  selectedType: CatalogTypeFilter;
  selectedCategoryId: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  onTypeChange: (type: CatalogTypeFilter) => void;
  onCategoryChange: (categoryId: number | null) => void;
  onPriceChange: (range: { minPrice: number | null; maxPrice: number | null }) => void;
  onReset: () => void;
};

export const FilterSidebar = ({
  categories,
  resultCount,
  selectedType,
  selectedCategoryId,
  minPrice,
  maxPrice,
  onTypeChange,
  onCategoryChange,
  onPriceChange,
  onReset,
}: FilterSidebarProps) => {
  const [minPriceDraft, setMinPriceDraft] = useState("");
  const [maxPriceDraft, setMaxPriceDraft] = useState("");

  useEffect(() => {
    setMinPriceDraft(minPrice !== null ? String(minPrice) : "");
    setMaxPriceDraft(maxPrice !== null ? String(maxPrice) : "");
  }, [minPrice, maxPrice]);

  const handlePriceSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onPriceChange({
      minPrice: minPriceDraft.trim() ? Number(minPriceDraft) : null,
      maxPrice: maxPriceDraft.trim() ? Number(maxPriceDraft) : null,
    });
  };

  const typeOptions: Array<{ label: string; value: CatalogTypeFilter }> = [
    { label: "Tất cả", value: "all" },
    { label: "Mua ngay", value: "SELL" },
    { label: "Thuê trang phục", value: "RENT" },
    { label: "Tùy chỉnh", value: "CUSTOM_MADE" },
  ];

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-foreground">Bộ lọc</span>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-primary transition-colors hover:opacity-80"
        >
          Xóa lọc
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Hình thức
        </p>
        <div className="flex flex-col gap-1">
          {typeOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => onTypeChange(option.value)}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                selectedType === option.value
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  selectedType === option.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background"
                }`}
              >
                {selectedType === option.value ? <Check className="h-3 w-3" /> : null}
              </span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-border/60" />

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Danh mục
        </p>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onCategoryChange(null)}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
              selectedCategoryId === null
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                selectedCategoryId === null
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background"
              }`}
            >
              {selectedCategoryId === null ? <Check className="h-3 w-3" /> : null}
            </span>
            Tất cả danh mục
          </button>
          {categories.length > 0 ? (
            categories.map((category) => (
              <button
                type="button"
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                  selectedCategoryId === category.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    selectedCategoryId === category.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background"
                  }`}
                >
                  {selectedCategoryId === category.id ? <Check className="h-3 w-3" /> : null}
                </span>
                {category.name}
              </button>
            ))
          ) : (
            <div className="rounded-lg px-3 py-2 text-sm text-muted-foreground">
              Chưa có danh mục
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-border/60" />

      <form className="flex flex-col gap-3" onSubmit={handlePriceSubmit}>
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Khoảng giá
        </p>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Từ
            <input
              type="number"
              min="0"
              value={minPriceDraft}
              onChange={(event) => setMinPriceDraft(event.target.value)}
              placeholder="0"
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Đến
            <input
              type="number"
              min="0"
              value={maxPriceDraft}
              onChange={(event) => setMaxPriceDraft(event.target.value)}
              placeholder="1000000"
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </label>
        </div>

        <button
          type="submit"
          className="h-10 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Áp dụng giá
        </button>
      </form>

      <div className="h-px bg-border/60" />

      <p className="text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{resultCount}</span> sản phẩm
      </p>
    </div>
  );
};
