import { useEffect, useRef, useState } from "react";
import DripratsImage from "../ui/DripratsImage";

const images = [
  "drip-frames/frame-001",
  "drip-frames/frame-002",
  "drip-frames/frame-001",
  "drip-frames/frame-002",
  "drip-frames/frame-003",
];

export default function FilmReel() {
  const reelRef = useRef<HTMLDivElement>(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const imageWidth = 180; // width + margin approx
  const imagesCount = images.length;
  const scrollSetWidth = imagesCount * imageWidth;

  // Duplicate images for infinite scroll effect
  const loopImages = [...images, ...images];

  function onScroll() {
    if (!reelRef.current) return;
    let scrollLeft = reelRef.current.scrollLeft;

    // If scrolled past the first set, reset scrollLeft back by one set width (seamless loop)
    if (scrollLeft >= scrollSetWidth) {
      reelRef.current.scrollLeft = scrollLeft - scrollSetWidth;
      scrollLeft = reelRef.current.scrollLeft;
    }

    // Calculate relative scroll position within one set
    const relativeScroll = scrollLeft % scrollSetWidth;

    // Center position of viewport
    const centerPos = relativeScroll + reelRef.current.offsetWidth / 2;

    // Find index closest to centerPos
    const index = Math.floor(centerPos / imageWidth) % imagesCount;

    setCenterIndex(index);
  }

  // Auto scroll using requestAnimationFrame for smoothness
  useEffect(() => {
    if (!reelRef.current) return;
    let rafId: number;
    let scrollLeft = 0;

    function step() {
      scrollLeft += 0.6; // speed adjust here
      if (scrollLeft >= scrollSetWidth) {
        scrollLeft -= scrollSetWidth;
      }
      if (reelRef.current) reelRef.current.scrollLeft = scrollLeft;
      onScroll();
      rafId = requestAnimationFrame(step);
    }

    // Initialize scrollLeft at start of second set for seamless effect
    reelRef.current.scrollLeft = 0;
    step();

    return () => cancelAnimationFrame(rafId);
  }, []);

  const sprocketCount = Math.floor((loopImages.length * imageWidth) / 40);

  return (
    <section style={{ background: "#fff", padding: "30px 0" }}>
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          textAlign: "center",
          marginBottom: "20px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          letterSpacing: "2px",
          color: "#111",
        }}
      >
        The Drip Frames
      </h2>
      <div
        ref={reelRef}
        style={{
          position: "relative",
          background: "#000",
          overflowX: "scroll",
          display: "flex",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          padding: "18px 0",
          userSelect: "none",
        }}
      >
        {/* Sprockets top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: loopImages.length * imageWidth,
            height: 12,
            display: "flex",
            justifyContent: "space-between",
            padding: "5px 5px 0px 5px",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 10,
          }}
        >
          {[...Array(sprocketCount)].map((_, i) => (
            <div
              key={"top" + i}
              style={{
                width: 15,
                height: 10,
                background: "#666",
                borderRadius: 2,
              }}
            />
          ))}
        </div>

        {/* Images */}
        {loopImages.map((src, idx) => {
          const dist = Math.min(
            Math.abs((idx % imagesCount) - centerIndex),
            imagesCount - Math.abs((idx % imagesCount) - centerIndex)
          );
          let scale = 1 - dist * 0.2;
          if (scale < 0.8) scale = 0.8;

          return (
            <div
              key={idx}
              style={{
                flex: "0 0 auto",
                transition: "transform 0.3s, filter 0.3s",
                transform: `scale(${scale})`,
                filter: scale > 0.95 ? "brightness(1)" : "brightness(0.7)",
                overflow: "hidden",
              }}
            >
              <DripratsImage
                src={src}
                alt="Driprats"
                width={150}
                height={200}
                style={{ display: "block", width: "100%", height: "100%" }}
                draggable={false}
                loading="lazy"
                className="rounded-md"
              />
            </div>
          );
        })}

        {/* Sprockets bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: loopImages.length * imageWidth,
            height: 12,
            display: "flex",
            justifyContent: "space-between",
            padding: "0 5px 5px 5px",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 10,
          }}
        >
          {[...Array(sprocketCount)].map((_, i) => (
            <div
              key={"bottom" + i}
              style={{
                width: 15,
                height: 10,
                background: "#666",
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
