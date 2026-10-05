"use client";

import { Phone } from "lucide-react";

const MOBILE_NUMBER = "9907800600";

const whatsappMessage = encodeURIComponent(
  "Hi, I would like to know more about your i-VANTAGE Coworking services."
);

export default function FloatingContactButtons() {
  return (
    <>
      {/* WhatsApp - Bottom Left */}
      <a
        href={`https://wa.me/91${MOBILE_NUMBER}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="
          floating-whatsapp
          fixed
          bottom-5
          left-4
          z-50
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-[#25D366]
          text-white
          shadow-lg
          transition-transform
          hover:scale-110
          sm:bottom-24
          sm:left-6
          sm:h-14
          sm:w-14
          lg:hidden
        "
      >
        <svg
          viewBox="0 0 32 32"
          className="h-6 w-6 sm:h-7 sm:w-7"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19.11 17.21c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.33-.79-.7-1.33-1.56-1.49-1.83-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.47.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.47-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.26s.97 2.62 1.11 2.8c.14.18 1.91 2.92 4.63 4.1.65.28 1.15.45 1.55.58.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z" />
          <path d="M16.02 3C8.84 3 3 8.84 3 16.02c0 2.3.6 4.46 1.65 6.34L3 29l6.8-1.61a12.96 12.96 0 0 0 6.22 1.58h.01C23.2 28.97 29 23.13 29 16.02 29 8.84 23.2 3 16.02 3zm0 23.67h-.01c-2.02 0-4-.54-5.72-1.57l-.41-.24-4.04.96.96-3.94-.27-.41a10.96 10.96 0 1 1 9.49 5.2z" />
        </svg>
      </a>

      {/* Call - Above WhatsApp */}
      <a
        href={`tel:+91${MOBILE_NUMBER}`}
        aria-label="Call us"
        className="
          floating-call
          fixed
          bottom-20
          left-4
          z-50
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-[#D9A32A]
          text-white
          shadow-lg
          transition-transform
          hover:scale-110
          sm:bottom-25
          sm:left-6
          sm:h-14
          sm:w-14
          lg:hidden
        "
      >
        <Phone
          size={21}
          strokeWidth={2.5}
          className="sm:h-6 sm:w-6"
        />
      </a>
    </>
  );
}