"use client";

import { useState } from "react";
import Link from "next/link";

import Logo from "../common/Logo";
import Container from "../common/Container";
import Button from "../ui/Button";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import HamburgerButton from "./HamburgerButton";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur-md shadow-xs">
        <Container className="flex h-17 items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-10 lg:flex">
            <NavLinks />
          </nav>

          {/* Desktop Action CTA */}
          <div className="hidden lg:block">
            <Link href="/contact">
              <Button>Book a Visit</Button>
            </Link>
          </div>

          {/* Mobile Animated Hamburger Button */}
          <HamburgerButton
            open={open}
            onClick={() => setOpen(!open)}
            className="lg:hidden"
          />
        </Container>
      </header>

      {/* Ultra-Premium Mobile Navigation Drawer */}
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}