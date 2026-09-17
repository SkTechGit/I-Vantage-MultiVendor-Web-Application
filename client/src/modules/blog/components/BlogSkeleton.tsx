export function BlogCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-xs animate-pulse">
      <div className="aspect-[16/10] w-full bg-slate-200" />
      <div className="p-6">
        <div className="h-3 w-24 rounded-full bg-slate-200" />
        <div className="mt-4 h-5 w-5/6 rounded-md bg-slate-200" />
        <div className="mt-2 h-5 w-4/6 rounded-md bg-slate-200" />
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full rounded-md bg-slate-100" />
          <div className="h-3 w-5/6 rounded-md bg-slate-100" />
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-slate-200" />
            <div className="h-3 w-20 rounded-md bg-slate-200" />
          </div>
          <div className="h-3 w-12 rounded-md bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedCardSkeleton() {
  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white animate-pulse lg:grid-cols-12">
      <div className="h-72 w-full bg-slate-200 sm:h-96 lg:col-span-7 lg:h-auto" />
      <div className="flex flex-col justify-between p-8 lg:col-span-5 lg:p-12">
        <div>
          <div className="h-4 w-32 rounded-full bg-slate-200" />
          <div className="mt-6 h-8 w-11/12 rounded-lg bg-slate-200" />
          <div className="mt-2 h-8 w-3/4 rounded-lg bg-slate-200" />
          <div className="mt-6 space-y-2.5">
            <div className="h-3.5 w-full rounded-md bg-slate-100" />
            <div className="h-3.5 w-full rounded-md bg-slate-100" />
            <div className="h-3.5 w-2/3 rounded-md bg-slate-100" />
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-200" />
            <div className="h-4 w-24 rounded-md bg-slate-200" />
          </div>
          <div className="h-8 w-28 rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 animate-pulse">
      <div className="h-4 w-36 rounded-full bg-slate-200" />
      <div className="mt-6 h-10 w-11/12 rounded-xl bg-slate-200" />
      <div className="mt-3 h-10 w-3/4 rounded-xl bg-slate-200" />
      <div className="mt-6 flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-slate-200" />
        <div className="h-4 w-32 rounded-md bg-slate-200" />
      </div>
      <div className="mt-10 aspect-[21/9] w-full rounded-2xl bg-slate-200" />
      <div className="mt-12 space-y-4">
        <div className="h-4 w-full rounded-md bg-slate-100" />
        <div className="h-4 w-full rounded-md bg-slate-100" />
        <div className="h-4 w-5/6 rounded-md bg-slate-100" />
      </div>
    </div>
  );
}
