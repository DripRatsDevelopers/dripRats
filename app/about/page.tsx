"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-10">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-semibold text-primary">About Driprats</h1>
        <p className="text-lg text-muted-foreground">
          Welcome to Driprats, where we combine luxury, elegance, and technology
          to bring you the finest fashion jewelry and accessories. Our mission
          is to provide every individual with a touch of luxury at an affordable
          price.
        </p>
      </section>

      {/* Mission and Vision Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Card className="shadow-none bg-transparent border-none">
          <CardContent>
            <h2 className="text-3xl font-semibold text-primary">Our Mission</h2>
            <p className="text-lg text-muted-foreground mt-4">
              At Driprats, we are committed to offering the highest quality
              fashion jewelry that reflects your unique style. We focus on
              excellence, customer satisfaction, and sustainability in every
              piece we create.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none bg-transparent border-none">
          <CardContent>
            <h2 className="text-3xl font-semibold text-primary">Our Vision</h2>
            <p className="text-lg text-muted-foreground mt-4">
              Our vision is to redefine jewelry fashion, creating designs that
              inspire confidence and beauty in every wearer. We aim to be a
              leader in the jewelry industry, known for innovation and customer
              trust.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Brand Story Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-primary">Our Brand Story</h2>
        <p className="text-lg text-muted-foreground">
          Founded in 2025, Driprats was born out of a passion for combining
          technology with luxury fashion. With a focus on high-quality materials
          and craftsmanship, we design pieces that empower you to express your
          individuality.
        </p>
        <div className="relative w-full h-72 md:h-96">
          <Image
            src="https://plus.unsplash.com/premium_photo-1664392251259-9bc373d3e43c?q=80&w=3139&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Brand Story Image"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center">
        <h2 className="text-3xl font-semibold text-primary">
          Join the Driprats Community
        </h2>
        <p className="text-lg text-muted-foreground mt-4">
          Explore our latest collections and find the perfect piece to elevate
          your style. Join us today and be part of the future of luxury jewelry.
        </p>
        <Link href="/shop" passHref>
          <Button className="mt-4">Shop Now</Button>
        </Link>
      </section>
    </div>
  );
}
