import { MapPin, Phone, Mail, Clock3, ArrowRight } from "lucide-react";
import Container from "@/components/common/Container";
import { contactConfig } from "../constants/contactConfig";

export default function ContactCards() {
  const cards = [
    {
      id: "visit",
      icon: MapPin,
      title: "Visit Us",
      lines: [
        contactConfig.address.building,
        contactConfig.address.unit,
        `${contactConfig.address.street}, ${contactConfig.address.city}, ${contactConfig.address.state} – ${contactConfig.address.pincode}`,
      ],
      ctaText: "Get Directions",
      ctaHref: contactConfig.directionsUrl,
      external: true,
      rotateOnHover: false,
    },
    {
      id: "call",
      icon: Phone,
      title: "Call Us",
      lines: [
        contactConfig.displayPhone,
        "Direct enquiry & workspace assistance",
      ],
      ctaText: "Call Now",
      ctaHref: `tel:${contactConfig.phone}`,
      external: false,
      rotateOnHover: true,
    },
    {
      id: "email",
      icon: Mail,
      title: "Email Us",
      lines: [
        contactConfig.email,
        "Send your questions or proposal requests",
      ],
      ctaText: "Send Email",
      ctaHref: `mailto:${contactConfig.email}`,
      external: false,
      rotateOnHover: false,
    },
    {
      id: "hours",
      icon: Clock3,
      title: "Business Hours",
      lines: [
        `Member Access: ${contactConfig.memberAccess}`,
        `Support: ${contactConfig.supportHours}`,
      ],
      ctaText: "24/7 Access for Members",
      ctaHref: "#location",
      external: false,
      isBadge: true,
      rotateOnHover: false,
    },
  ];

  return (
    <section className="bg-white py-12 sm:py-16">
      <Container>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-[#FDFEFF] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-7"
              >
                <div>
                  {/* Modernized Icon Container */}
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100/60 bg-blue-50/90 text-[#1E5BFF] shadow-2xs transition-all duration-300 group-hover:border-[#0A1F66] group-hover:bg-[#0A1F66] group-hover:text-white ${
                      card.rotateOnHover
                        ? "group-hover:[&>svg]:rotate-12 transition-transform"
                        : ""
                    }`}
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.85}
                      className="transition-transform duration-200"
                    />
                  </div>

                  {/* Title */}
                  <h2 className="mt-4 text-lg font-bold text-[#0A1F66]">
                    {card.title}
                  </h2>

                  {/* Content lines */}
                  <div className="mt-2.5 space-y-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {card.lines.map((line, idx) => (
                      <p
                        key={idx}
                        className={
                          idx === 0 ? "font-semibold text-slate-800" : ""
                        }
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 border-t border-slate-100 pt-4">
                  {card.isBadge ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E5BFF]">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {card.ctaText}
                    </span>
                  ) : (
                    <a
                      href={card.ctaHref}
                      target={card.external ? "_blank" : undefined}
                      rel={card.external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5BFF] transition-all duration-200 group-hover:gap-2 hover:text-[#0A1F66] sm:text-sm"
                    >
                      <span>{card.ctaText}</span>
                      <ArrowRight
                        size={14}
                        strokeWidth={2}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
