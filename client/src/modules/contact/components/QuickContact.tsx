import { Phone, MessageCircle, Clock3 } from "lucide-react";
import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";
import { contactConfig } from "../constants/contactConfig";

export default function QuickContact() {
  return (
    <section className="border-y border-slate-100 bg-white py-12 sm:py-16">
      <Container>
        <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/30 to-blue-50/70 p-6 shadow-xs sm:p-10 lg:p-12">
          <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
            {/* Text */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1E5BFF]">
                <Clock3 size={14} strokeWidth={1.85} />
                <span>Instant Assistance</span>
              </div>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0A1F66] sm:text-3xl">
                Need a Quick Response?
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                For immediate assistance, call us directly or start a WhatsApp
                conversation with our team.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex w-full flex-col items-center gap-3.5 sm:w-auto sm:flex-row sm:gap-4">
              <a href={`tel:${contactConfig.phone}`} className="group w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  <Phone
                    size={17}
                    strokeWidth={1.85}
                    className="transition-transform duration-200 group-hover:rotate-12"
                  />
                  <span>Call {contactConfig.displayPhone}</span>
                </Button>
              </a>

              <a
                href={contactConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-auto"
              >
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto bg-[#25D366] text-white hover:bg-[#1EBE5D] border-none shadow-xs"
                >
                  <MessageCircle
                    size={17}
                    strokeWidth={1.85}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />
                  <span>Chat on WhatsApp</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
