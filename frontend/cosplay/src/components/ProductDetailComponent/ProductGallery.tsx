import { useState } from "react";

type Props = {
  images: string[];
  name: string;
};

export const ProductGallery = ({ images, name }: Props) => {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
        <img
          src={images[active]}
          alt={`Trang phục ${name} — ảnh ${active + 1}`}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2" role="tablist" aria-label="Ảnh sản phẩm">
          {images.map((img, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={active === i}
              aria-label={`Xem ảnh ${i + 1} của ${images.length}`}
              onClick={() => setActive(i)}
              className={`relative aspect-square w-20 overflow-hidden rounded-lg border-2 transition-all ${
                active === i
                  ? "border-primary"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`${name} ảnh ${i + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
