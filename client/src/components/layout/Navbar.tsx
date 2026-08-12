"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import Logo from "../common/Logo";
import Container from "../common/Container";
import Button from "../ui/Button";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";


export default function Navbar() {
  const [open, setOpen] = useState(false);
 

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur-md shadow-sm">
        <Container className="flex h-17 items-center justify-between">

          <Logo />

          <nav className="hidden items-center gap-10 lg:flex">
            <NavLinks />
          </nav>

          <div className="hidden lg:block">
       
            <Link href="/contact" className="w-full sm:w-auto"> 
              <Button>
                Book a Visit
              </Button>
           </Link>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 transition hover:bg-blue-50 lg:hidden"
          >
            <Menu
              size={28}
              className="text-[#0B2E8A]"
            />
          </button>

        </Container>
         
      </header>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}