import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContactButtons from "@/components/common/FloatingContactButtons";
import { VikiBot } from "@/components/viki";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />

      <main>{children}</main>
        <VikiBot />
      <FloatingContactButtons />

      <Footer />
    </>
  );
}