import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function Logo({
  width = 90,
  height = 23,
  className = "",
}: LogoProps) {
  return (
    <Link href="/">
      <Image
        src="/images/ivantage.png"
        alt="I-Vantage Business Hub"
        width={width}
        height={height}
        priority
        className={className}
      />
    </Link>
  );
}