"use client";

interface HamburgerButtonProps {
  open: boolean;
  onClick: () => void;
  className?: string;
}

export default function HamburgerButton({
  open,
  onClick,
  className = "",
}: HamburgerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={open}
      aria-controls="mobile-navigation-drawer"
      className={`group relative flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200 hover:bg-blue-50/80 active:bg-blue-100/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BFF] ${className}`}
    >
      <div className="relative h-4.5 w-5.5">
        {/* Top line */}
        <span
          className={`absolute left-0 block h-[2px] w-full rounded-full bg-[#0A1F66] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? "top-2 rotate-45 bg-[#0A1F66]" : "top-0"
          }`}
        />

        {/* Middle line */}
        <span
          className={`absolute left-0 top-2 block h-[2px] w-full rounded-full bg-[#0A1F66] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
          }`}
        />

        {/* Bottom line */}
        <span
          className={`absolute left-0 block h-[2px] w-full rounded-full bg-[#0A1F66] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? "top-2 -rotate-45 bg-[#0A1F66]" : "top-4"
          }`}
        />
      </div>
    </button>
  );
}
