import { Link, useParams } from "react-router-dom";

type StaticPageProps = {
  title: string;
  description: string;
};

export const StaticPage = ({ title, description }: StaticPageProps) => {
  const params = useParams();

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col justify-center px-4 py-16 md:px-6">
      <div className="rounded-3xl border border-border bg-card p-8 md:p-12">
        <p className="text-sm font-semibold tracking-[0.14em] text-primary uppercase">
          Trang tĩnh
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
          {description}
        </p>

        {params.id && (
          <div className="mt-6 rounded-2xl bg-muted/40 p-4 text-sm text-foreground">
            Mã tham chiếu: <span className="font-semibold">{params.id}</span>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Về trang chủ
          </Link>
          <Link
            to="/products"
            className="inline-flex rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Xem sản phẩm
          </Link>
        </div>
      </div>
    </main>
  );
};