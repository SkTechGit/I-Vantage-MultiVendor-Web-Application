import React from "react";

export interface VikiIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  strokeWidth?: number | string;
}

/**
 * VikiIcon - Sleek Cyber-Visor AI Assistant Icon
 * Pristine aerodynamic AI capsule with high-tech cyber-visor strip.
 */
export default function VikiIcon({
  size = 22,
  className = "",
  strokeWidth = 2,
  ...props
}: VikiIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {/* Sleek top antenna arc */}
      <path d="M12 2a4 4 0 0 1 4 4v1" />
      {/* Modern aerodynamic capsule head */}
      <rect x="3" y="7" width="18" height="13" rx="6.5" />
      {/* Cyber-visor horizontal connector strip */}
      <path d="M8 13.5h8" strokeWidth={2.5} strokeLinecap="round" />
      {/* Dual optical eye sensors */}
      <circle cx="9" cy="13.5" r="1" fill="currentColor" />
      <circle cx="15" cy="13.5" r="1" fill="currentColor" />
    </svg>
  );
}
