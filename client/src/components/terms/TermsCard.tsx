interface TermsCardProps {
  title: string;
  children: React.ReactNode;
}

export default function TermsCard({
  title,
  children,
}: TermsCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
      <h2 className="text-xl font-bold leading-tight text-[#0A1F66] sm:text-2xl">
        {title}
      </h2>

      <div className="mt-5">
        {children}
      </div>
    </section>
  );
}