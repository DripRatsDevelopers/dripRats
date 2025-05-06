"use client";

import { useMediaQuery } from "@/lib/mediaUtils";
import { cn } from "@/lib/utils";
import { Expand, X } from "lucide-react"; // Added X for close button
import Image from "next/image";
import { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import { FreeMode, Keyboard, Navigation, Thumbs, Zoom } from "swiper/modules";
import { Swiper, SwiperClass, SwiperRef, SwiperSlide } from "swiper/react";
import { Button } from "../ui/button";

interface ProductGalleryProps {
  images: { src: string; alt?: string }[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass>();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mainSwiperRef = useRef<SwiperRef>(null);
  const [activeIndex, setActiveIndex] = useState(0); // Active index state

  const handleFullscreen = () => {
    setIsFullscreen(true);
    const swiperEl = mainSwiperRef.current?.swiper?.el;
    if (swiperEl) {
      swiperEl.requestFullscreen();
    }
  };

  const handleExitFullscreen = () => {
    document.exitFullscreen();
    setIsFullscreen(false);
  };

  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col-reverse md:flex-row gap-2 relative md:mt-4 h-[500px] md:h-auto mt-4 md:mt-0">
      <div>
        <Swiper
          onSwiper={setThumbsSwiper}
          direction={isMobile ? "horizontal" : "vertical"}
          spaceBetween={10}
          slidesPerView={isMobile ? 4 : 5}
          freeMode
          watchSlidesProgress
          modules={[FreeMode, Thumbs]}
          className="h-[100px] md:h-[600px] md:w-auto overflow-hidden w-full md:w-[120px] flex justify-center items-center "
        >
          {images.map((image, index) => (
            <SwiperSlide
              key={index}
              className={`w-full md:w-[120px] flex justify-center items-center mt-4 md:mt-0`}
              onClick={() => setActiveIndex(index)}
            >
              <div
                className={
                  "relative w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-lg overflow-hidden"
                }
              >
                <Image
                  src={image.src}
                  alt={image.alt || `Thumbnail ${index + 1}`}
                  fill
                  className={cn(
                    "object-cover cursor-pointer rounded-lg",
                    activeIndex === index
                      ? "opacity-100"
                      : "opacity-40 hover:opacity-70"
                  )}
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Main Image */}
      <div className="relative flex-1 flex justify-center items-center md:w-3/4">
        <Swiper
          ref={mainSwiperRef}
          spaceBetween={10}
          zoom={{ maxRatio: 2 }}
          navigation
          keyboard
          thumbs={{ swiper: thumbsSwiper }}
          modules={[Zoom, Navigation, Thumbs, Keyboard]}
          className="w-full h-full rounded-lg"
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {images.map((image, index) => (
            <SwiperSlide
              key={index}
              className="w-full h-full flex justify-center items-center"
            >
              <div className="swiper-zoom-container w-full h-full">
                <Image
                  src={image.src}
                  alt={image.alt || `Product image ${index + 1}`}
                  fill
                  objectFit={isFullscreen ? "contain" : "cover"} // Adjust image fit on fullscreen
                  className="rounded-lg"
                  priority={index === 0}
                  loading={index > 0 ? "lazy" : "eager"}
                />
              </div>
            </SwiperSlide>
          ))}
          {isFullscreen && (
            <Button
              variant="ghost"
              onClick={handleExitFullscreen}
              className="absolute top-2 right-2 z-10 p-1 rounded-full bg-secondary"
              aria-label="Exit Fullscreen"
            >
              <X /> {/* Close button icon */}
            </Button>
          )}
        </Swiper>

        {/* Fullscreen button */}
        <Button
          variant="ghost"
          onClick={handleFullscreen}
          className="absolute top-2 bg-secondary right-2 z-10 p-2 rounded-full"
          aria-label="Fullscreen"
        >
          <Expand />
        </Button>
      </div>

      {/* Thumbnail Swiper */}
    </div>
  );
}
