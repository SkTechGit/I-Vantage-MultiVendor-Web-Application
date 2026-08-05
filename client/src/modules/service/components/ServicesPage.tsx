import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <section className="bg-slate-50 py-24">
      <Container className="text-center">

        <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-[#1E5BFF]">
          Business Services
        </span>

        <h1 className="mt-6 text-5xl font-bold text-[#0A1F66]">
          100+ Business Support Services
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
          From coworking spaces and virtual offices to company
          registration, legal compliance, finance, HR and technology
          support, I-Vantage Business Hub helps businesses grow under
          one roof.
        </p>

        <div className="mt-10">
          <Link href="/">
            <Button>
              Explore Services on Homepage
            </Button>
          </Link>
        </div>

      </Container>
    </section>
  );
}