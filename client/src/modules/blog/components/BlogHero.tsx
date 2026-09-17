import Container from "@/components/common/Container";

export default function BlogHero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white py-14 sm:py-20 lg:py-24">
      {/* Decorative Brand Accent Background */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-amber-50/60 blur-2xl" />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Category/Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#0A1F66] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C8942C]" />
            i-VANTAGE Insights & Knowledge Base
          </div>

          {/* Main Headline */}
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-[#0A1F66] sm:text-5xl sm:leading-tight lg:text-6xl">
            Strategic Insights for Growing Businesses & Founders
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-8">
            Authoritative guides, regulatory intelligence, and workspace playbooks on virtual offices, company registration, coworking, tax compliance, and business scaling in India.
          </p>

          {/* Subtle Gold Accent Divider */}
          <div className="mx-auto mt-8 h-1 w-16 rounded-full bg-[#C8942C]" />
        </div>
      </Container>
    </section>
  );
}
