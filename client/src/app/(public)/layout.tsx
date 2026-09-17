import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContactButtons from "@/components/common/FloatingContactButtons";
import VikiClientWrapper from "@/components/viki/VikiClientWrapper";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />

      <main>{children}</main>
      <VikiClientWrapper />
      <FloatingContactButtons />

      <Footer />
    </>
  );
}