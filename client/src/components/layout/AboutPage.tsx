import Link from "next/link";

import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <section className="bg-slate-50 py-24">
      <Container className="text-center">

        <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-[#1E5BFF]">
          About I-Vantage
        </span>

        <h1 className="mt-6 text-5xl font-bold text-[#0A1F66]">
          Empowering Businesses to
          <br />
          Work, Connect & Grow
        </h1>

        <p className="mx-auto mt-8 max-w-4xl text-lg leading-8 text-slate-600">
          I-Vantage Business Hub is a one-stop destination for
          entrepreneurs, startups, SMEs and enterprises looking for
          premium coworking spaces and comprehensive business support
          services. From workspace solutions and virtual offices to
          company registration, finance, HR, legal, technology and
          business consulting, we help businesses build, manage and
          scale with confidence.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <Link href="/services">
            <Button>
              Explore Our Services
            </Button>
          </Link>

          <Link href="/contact">
            <Button variant="outline">
              Contact Us
            </Button>
          </Link>

        </div>

      </Container>
    </section>
  );
}