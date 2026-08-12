"use client";

import { X } from "lucide-react";

import Logo from "../common/Logo";
import NavLinks from "./NavLinks";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({
  open,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      />

      <div className="fixed right-0 top-0 z-50 h-full w-72 bg-gradient-to-b from-white to-[#F5F9FF] shadow-2xl">

        <div className="flex items-center justify-between border-b border-blue-100 p-6">

          <Logo width={60} />

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-blue-50"
          >
            <X
              size={24}
              className="text-[#0B2E8A]"
            />
          </button>

        </div>

        <div className="flex flex-col gap-7 p-6">
          <NavLinks onClick={onClose} />
        </div>

      </div>
    </>
  );
}