"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";

interface GalleryImage {
  src: string;
  title: string;
  category?: string;
}

interface WorkspaceGalleryProps {
  images: GalleryImage[];
}

export default function WorkspaceGallery({
  images,
}: WorkspaceGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    null
  );

  const selectedImage =
    selectedIndex !== null ? images[selectedIndex] : null;

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const showPrevious = () => {
    if (selectedIndex === null) return;

    setSelectedIndex(
      selectedIndex === 0 ? images.length - 1 : selectedIndex - 1
    );
  };

  const showNext = () => {
    if (selectedIndex === null) return;

    setSelectedIndex(
      selectedIndex === images.length - 1 ? 0 : selectedIndex + 1
    );
  };

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  return (
    <>
      {/* =========================================================
          GALLERY
      ========================================================= */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12 lg:grid-rows-2">
        {/* Main Image */}
        <button
          type="button"
          onClick={() => setSelectedIndex(0)}
          className="group relative min-h-[260px] overflow-hidden  cursor-pointer rounded-2xl bg-slate-100 text-left sm:min-h-[340px] lg:col-span-7 lg:row-span-2 lg:min-h-[520px]"
          aria-label={`View ${images[0]?.title}`}
        >
          {images[0] && (
            <>
              <Image
                src={images[0].src}
                alt={images[0].title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <div className="flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    {images[0].category && (
                      <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-white/80">
                        {images[0].category}
                      </p>
                    )}

                    <h3 className="text-lg font-semibold leading-tight text-white sm:text-xl">
                      {images[0].title}
                    </h3>
                  </div>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#0A1F66] shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Maximize2 size={17} />
                  </span>
                </div>
              </div>
            </>
          )}
        </button>

        {/* Second Image */}
        {images[1] && (
          <button
            type="button"
            onClick={() => setSelectedIndex(1)}
            className="group relative min-h-[220px] cursor-pointer overflow-hidden rounded-2xl bg-slate-100 text-left lg:col-span-5 lg:min-h-0"
            aria-label={`View ${images[1].title}`}
          >
            <Image
              src={images[1].src}
              alt={images[1].title}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
              <h3 className="text-base font-semibold text-white sm:text-lg">
                {images[1].title}
              </h3>
            </div>
          </button>
        )}

        {/* Third + Fourth Images */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-5">
          {images.slice(2, 4).map((image, index) => {
            const actualIndex = index + 2;

            return (
              <button
                key={image.src}
                type="button"
                onClick={() => setSelectedIndex(actualIndex)}
                className="group relative min-h-[150px] overflow-hidden cursor-pointer rounded-2xl bg-slate-100 text-left sm:min-h-[190px]"
                aria-label={`View ${image.title}`}
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 21vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-white sm:text-base">
                    {image.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          LIGHTBOX
      ========================================================= */}
      {selectedImage && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 sm:right-5 sm:top-5"
            aria-label="Close image preview"
          >
            <X size={22} />
          </button>

          {/* Previous */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 sm:left-5 sm:h-12 sm:w-12"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative flex h-[82vh] w-full max-w-6xl items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedImage.src}
              alt={selectedImage.title}
              fill
              sizes="100vw"
              className="object-contain"
            />

            {/* Image information */}
            <div className="absolute bottom-0 left-1/2 w-[calc(100%-70px)] max-w-2xl -translate-x-1/2 rounded-xl bg-black/50 px-4 py-3 text-center backdrop-blur-md sm:px-6">
              <p className="text-sm font-medium text-white sm:text-base">
                {selectedImage.title}
              </p>

              <p className="mt-1 text-xs text-white/60">
                {selectedIndex + 1} / {images.length}
              </p>
            </div>
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 sm:right-5 sm:h-12 sm:w-12"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}
    </>
  );
}