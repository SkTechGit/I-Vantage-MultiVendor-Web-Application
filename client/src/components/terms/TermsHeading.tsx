interface TermsHeadingProps {
  title: string;
  description?: string;
}

export default function TermsHeading({
  title,
  description,
}: TermsHeadingProps) {
  return (
    <section className="bg-[#0A1F66] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-200">
          i-VANTAGE Business Hub
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Terms of Use
        </h1>

        <h2 className="mt-4 text-xl font-semibold text-white sm:text-2xl">
          {title}
        </h2>

        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}