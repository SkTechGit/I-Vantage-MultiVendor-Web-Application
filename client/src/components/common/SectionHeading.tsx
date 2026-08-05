interface Props {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({
  title,
  subtitle,
}: Props) {
  return (
    <div className="mx-auto mb-16 max-w-4xl text-center">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C8942C]/20 bg-[#C8942C]/10 px-4 py-1">
        <span className="h-2 w-2 rounded-full bg-[#C8942C]" />
        <span className="text-sm font-semibold uppercase tracking-widest text-[#C8942C]">
          i-VANTAGE BUSINESS HUB
        </span>
      </div>

      <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#0A1F66] sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}