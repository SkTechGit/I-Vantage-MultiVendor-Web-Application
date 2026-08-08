interface Props {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({
  title,
  subtitle,
}: Props) {
  return (
    <div className="mx-auto w-full min-w-0 max-w-3xl px-2 text-center sm:px-0">
      {/* Brand Label */}
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1E5BFF] sm:text-xs sm:tracking-[0.22em]">
        i-VANTAGE BUSINESS HUB
      </p>

      {/* Heading */}
      <h2 className="mt-2.5 text-2xl font-bold leading-[1.2] tracking-tight text-[#0A1F66] sm:mt-3 sm:text-3xl lg:text-4xl">
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
          {subtitle}
        </p>
      )}
    </div>
  );
}