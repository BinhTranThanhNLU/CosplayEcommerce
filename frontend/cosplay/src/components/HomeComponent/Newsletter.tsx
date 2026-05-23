export const Newsletter = () => {
  return (
    <section className="bg-muted/20 py-14">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <h2 className="text-xl font-bold text-foreground md:text-2xl">
              Nhận tin mới từ cosplay.vn
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Khu vực đăng ký demo, giữ giao diện cho giai đoạn sau.
            </p>
          </div>

          <form className="flex w-full max-w-md gap-2">
            <input
              type="email"
              placeholder="Email của bạn"
              className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
            <button
              type="submit"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
