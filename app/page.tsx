"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RecentlyViewedProducts from "./components/common/RecentlyViewedProducts";
import LookbookReel from "./components/homePage/LookBookReel";
import { Button } from "./components/ui/button";
import DripratsImage from "./components/ui/DripratsImage";
import { useMediaQuery } from "./lib/mediaUtils";
import { cn } from "./lib/utils";

const hotspots = [
  {
    id: 1,
    x: "50%",
    y: "60%",
    product: {
      Name: "Celestial Hoops",
      Price: "₹2,499",
      Image:
        "https://images.unsplash.com/photo-1681091646207-f14c4e49da4b?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
  {
    id: 2,
    x: "87%",
    y: "52%",
    product: {
      Name: "Starfall Necklace",
      Price: "₹3,299",
      Image:
        "https://images.unsplash.com/photo-1689287428894-9b52d1534a25?q=80&w=2433&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
];

const products = [
  {
    id: 1,
    title: "Eclipse Hoops",
    price: "₹1,999",
    image:
      "https://images.unsplash.com/photo-1679412330075-ef0c1c79f8a8?q=80&w=1080&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Solar Ring",
    price: "₹1,499",
    image:
      "https://images.unsplash.com/photo-1679412330075-ef0c1c79f8a8?q=80&w=1080&auto=format&fit=crop",
  },
];

const collections = [
  {
    id: 1,
    title: "Cosmic Radiance",
    image:
      "https://images.unsplash.com/photo-1679412330075-ef0c1c79f8a8?q=80&w=1080&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Urban Muse",
    image:
      "https://images.unsplash.com/photo-1679412330075-ef0c1c79f8a8?q=80&w=1080&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Nocturne Elegance",
    image:
      "https://images.unsplash.com/photo-1679412330075-ef0c1c79f8a8?q=80&w=1080&auto=format&fit=crop",
  },
];

const perks = [
  { icon: "🚚", title: "Pan-India Delivery" },
  { icon: "📦", title: "Premium Eco Packaging" },
  { icon: "🔐", title: "Secure Payments" },
  { icon: "💎", title: "Lifetime Free Refurbishment For Members" },
];

const testimonials = [
  {
    name: "Aanya R.",
    quote:
      "The craftsmanship is insane. This is my third Driprats piece and I'm obsessed.",
  },
  {
    name: "Tanish Q.",
    quote:
      "It's rare to find jewelry that feels this futuristic yet luxurious. 10/10.",
  },
  {
    name: "Reya M.",
    quote:
      "Wore the Eclipse Hoops to a party and got so many compliments. I felt powerful.",
  },
];

export default function HomePage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const router = useRouter();
  const handleHotspot = (id: number) => {
    if (isMobile) setActiveHotspot((prev) => (prev === id ? null : id));
  };

  const HeroText = (
    <div className="max-w-lg z-10">
      <h1 className="text-5xl font-bold mb-4">Own the Spotlight</h1>
      <p className="text-lg opacity-80 mb-6">
        Luxury jewellery to elevate your vibe.
      </p>
      <Button
        className="px-6 py-3 bg-white text-black dark:bg-black dark:text-white rounded-md shadow hover:opacity-90 transition"
        onClick={() => {
          router.push("/shop/all");
        }}
      >
        Explore Collection
      </Button>
    </div>
  );
  return (
    <div>
      {/* HERO */}
      <section className="w-full">
        {/* Desktop View */}
        <div className="hidden md:flex w-full h-screen">
          {/* Image Side */}
          <div className="relative w-1/2 h-full">
            <Image
              src="https://images.unsplash.com/photo-1679412330075-ef0c1c79f8a8?q=80&w=1920&auto=format&fit=crop"
              alt="Model"
              fill
              className="object-cover object-center"
              priority
            />

            {hotspots.map((spot) => (
              <div key={spot.id}>
                <div
                  className="absolute w-5 h-5 rounded-full border-2 border-white bg-white animate-ping cursor-pointer z-20"
                  style={{ left: spot.x, top: spot.y }}
                  onMouseEnter={() => setActiveHotspot(spot.id)}
                  onMouseLeave={() => setActiveHotspot(null)}
                />
                <div
                  className={cn(
                    "absolute transition-all duration-300 ease-in-out z-20",
                    activeHotspot === spot.id
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95"
                  )}
                  style={{
                    left: spot.x,
                    top: spot.y,
                  }}
                >
                  <div
                    className="w-50 backdrop-blur-md p-5 space-y-2 rounded-xl border border-white/30 dark:border-black/30 bg-black/90 dark:bg-white text-white dark:text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] dark:shadow-[0_0_20px_rgba(0,0,0,0.3)] shadow-xl"
                    onMouseEnter={() => setActiveHotspot(spot.id)}
                  >
                    <div className="w-30 h-30 relative text-center w-full">
                      <Image
                        src={spot.product.Image}
                        alt={spot.product.Name}
                        fill
                        className="object-cover object-center rounded-md"
                      />
                    </div>
                    <p className="text-sm opacity-90">Featured</p>
                    <h3 className="text-md font-semibold">
                      {spot.product.Name}
                    </h3>
                    <p className="text-neutral-300 dark:text-neutral-700">
                      {spot.product.Price}
                    </p>
                    <Button className="px-4 py-2 bg-white dark:bg-black text-black dark:text-white text-sm rounded hover:opacity-90 transition w-full">
                      View Product
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Text Side */}
          <div className="w-1/2 flex items-center justify-center bg-black text-white dark:bg-white dark:text-black px-16">
            {HeroText}
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden relative flex flex-col w-full h-screen">
          <div className="relative w-full">
            <DripratsImage
              src="banners/hero-image.jpg"
              alt="Driprats Hero"
              layout="responsive"
              width={3}
              height={4}
              className="object-contain"
              priority
              onClick={() => setActiveHotspot(null)}
            />
            <div>
              {hotspots.map((spot) => (
                <div key={spot.id}>
                  <div
                    className="absolute w-5 h-5 rounded-full border-2 border-white bg-white animate-ping cursor-pointer z-20"
                    style={{ left: spot.x, top: spot.y }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleHotspot(spot.id);
                    }}
                  />
                  {activeHotspot === spot.id && (
                    <div className="absolute left-1/2 bottom-[10%] space-y-1 -translate-x-1/2  text-black shadow-xl z-30 backdrop-blur-md p-5 rounded-xl border border-white/30 dark:border-black/30 bg-black/90 dark:bg-white text-white dark:text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] dark:shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                      <div className="w-30 h-30 relative text-center w-full">
                        <Image
                          src={spot.product.Image}
                          alt={spot.product.Name}
                          fill
                          className="object-cover object-center rounded-md"
                        />
                      </div>
                      <p className="text-sm">Featured</p>
                      <h3 className="text-md font-semibold">
                        {spot.product.Name}
                      </h3>
                      <p className="text-neutral-300 dark:text-neutral-700">
                        {spot.product.Price}
                      </p>
                      <Button className="px-2 py-1 bg-white dark:bg-black text-black dark:text-white text-sm rounded hover:opacity-90 transition w-full">
                        View Product
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Overlay Text moved to top */}
          <div className="w-full flex-grow text-center pb-2 bg-black text-white dark:bg-white dark:text-black">
            {HeroText}
          </div>

          {/* Hotspots */}
        </div>
      </section>

      {/* SIGNATURE DROPS */}
      <section className="py-8 px-4 md:px-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Signature Drops
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden border border-neutral-700 p-4 rounded-lg hover:shadow-xl transition"
            >
              <Image
                src={product.image}
                alt={product.title}
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
              <div
                className="absolute bottom-0 left-0 right-0 md:inset-0 bg-black/50 md:bg-black/70 text-white  opacity-0 group-hover:opacity-100
            md:opacity-0 md:group-hover:opacity-100
            opacity-100 md:opacity-0 transition flex flex-col justify-center items-center transition-opacity duration-300"
              >
                <h3 className="text-xl font-semibold">{product.title}</h3>
                <p className="text-lg">{product.price}</p>
                <Button
                  className="px-6 py-3 bg-white text-black dark:bg-black dark:text-white"
                  onClick={() => {
                    router.push("/shop/all");
                  }}
                >
                  View Item
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="py-20 px-6 md:px-32 bg-neutral-900 text-center text-white">
        <h2 className="text-3xl font-bold mb-6">The Driprats Ethos</h2>
        <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
          Born from the collision of futurism and luxury — Driprats redefines
          statement jewelry. We believe power lies in the bold, and elegance
          lives in the unexpected.
        </p>
      </section>

      {/* COLLECTIONS */}
      <section className="py-16 px-4 md:px-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Explore Collections
        </h2>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {collections.map((col) => (
            <div
              key={col.id}
              className="min-w-[250px] text-center border border-neutral-300 rounded-lg p-4"
            >
              <Image
                src={col.image}
                alt={col.title}
                width={250}
                height={250}
                className="rounded-lg mb-4 object-cover"
              />
              <h3 className="text-xl">{col.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* LUXURY PERKS */}
      <section className="py-20 px-4 md:px-16 bg-neutral-950 text-white">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          Why Driprats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {perks.map((perk, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-4xl mb-4">{perk.icon}</div>
              <p className="text-lg font-medium">{perk.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-4 md:px-16 bg-neutral-900 text-white">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          What They&apos;re Saying
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="border border-neutral-700 p-6 rounded-lg bg-neutral-800"
            >
              <p className="italic text-neutral-300 mb-4">
                &quot;{t.quote}&quot;
              </p>
              <p className="text-sm text-neutral-400">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <LookbookReel />
      {/* RECENTLY VIEWED */}
      <section className="py-4 pb-5 px-4 md:px-8">
        <RecentlyViewedProducts />
      </section>
    </div>
  );
}
