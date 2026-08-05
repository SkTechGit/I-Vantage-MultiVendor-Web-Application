import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function ContactPage() {
  return (
    <section className="bg-slate-50 py-24">
      <Container className="text-center">

        <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-[#1E5BFF]">
          Contact Us
        </span>

        <h1 className="mt-6 text-5xl font-bold text-[#0A1F66]">
          Let's Build Your Business Together
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
          Whether you're looking for a workspace, business registration,
          legal support, finance services or mentorship, our team is
          ready to help you.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <Button>
            +91 99078 00600
          </Button>

          <Link href="mailto:info@i-vantage.in">
            <Button variant="outline">
              info@i-vantage.in
            </Button>
          </Link>

        </div>

      </Container>
    </section>
  );
}