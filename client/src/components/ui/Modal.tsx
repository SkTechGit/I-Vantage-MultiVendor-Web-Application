"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
}: Props) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onClose}
    >
      <Dialog.Portal>

        {/* Overlay */}

        <Dialog.Overlay
          className="
          fixed
          inset-0
          z-50
          bg-black/50
          backdrop-blur-sm
        "
        />

        {/* Modal */}

        <Dialog.Content
          className="
          fixed
          left-1/2
          top-1/2
          z-50

          w-[95vw]
          max-w-3xl

          max-h-[90vh]

          -translate-x-1/2
          -translate-y-1/2

          overflow-hidden

          rounded-2xl

          bg-white

          shadow-2xl
        "
        >

          {/* Header */}

          <div
            className="
            sticky
            top-0
            z-20

            flex
            items-center
            justify-between

            border-b

            bg-white

            px-6
            py-5
          "
          >

            <Dialog.Title
              className="
              text-2xl
              font-bold
              text-[#0A1F66]
            "
            >
              {title}
            </Dialog.Title>

            <Dialog.Close asChild>

              <button
                className="
                rounded-lg
                p-2
                transition

                hover:bg-gray-100
              "
              >
                <X size={22} />
              </button>

            </Dialog.Close>

          </div>

          {/* Body */}

          <div
            className="
            max-h-[calc(90vh-82px)]

            overflow-y-auto

            p-6
          "
          >
            {children}
          </div>

        </Dialog.Content>

      </Dialog.Portal>
    </Dialog.Root>
  );
}