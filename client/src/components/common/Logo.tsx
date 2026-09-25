import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  href?: string | null;
}

export default function Logo({
  width = 65,
  height = 52,
  className = "",
  imageClassName = "",
  priority = true,
  href = "/",
}: LogoProps) {
  const imageElement = (
    <Image
      src="/images/ivantage.png"
      alt="i-VANTAGE Business Hub"
      width={width}
      height={height}
      priority={priority}
      className={`h-11 sm:h-12 w-auto object-contain select-none transition-transform duration-200 hover:scale-102 ${imageClassName || className}`}
    />
  );

  if (href === null || href === "") {
    return <span className={`inline-flex items-center shrink-0 ${className}`}>{imageElement}</span>;
  }

  return (
    <Link href={href} className={`inline-flex items-center shrink-0 ${className}`}>
      {imageElement}
    </Link>
  );
}