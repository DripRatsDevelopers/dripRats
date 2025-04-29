"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const supportEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return (
    <footer className="bg-muted text-muted-foreground dark:bg-black dark:text-white px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-10">
        {/* Brand */}
        <Card className="bg-transparent border-none shadow-none">
          <CardContent className="p-0">
            <h2 className="text-xl font-bold tracking-wide">Driprats</h2>
            <p className="text-sm mt-2 text-muted-foreground">
              Luxury. Identity. Future.
            </p>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card className="bg-transparent border-none shadow-none py-0 md:py-6">
          <CardContent className="p-0">
            <h3 className="text-sm font-semibold mb-3">Explore</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/shop/all">Collections</Link>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/support">Support</Link>
              </li>
              <li>
                <Link href="/terms">Terms & Conditions</Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-transparent border-none shadow-none">
          <CardContent className="p-0">
            <h2 className="text-sm font-semibold mb-2 text-primary">Legal</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:underline">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:underline">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation-policy" className="hover:underline">
                  Cancellation Policy
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-transparent border-none shadow-none">
          <CardContent className="p-0">
            <h3 className="text-sm font-semibold mb-3">Contact</h3>
            <Button
              variant="ghost"
              className="p-0 h-auto text-muted-foreground"
              asChild
            >
              <Link
                href={`mailto:${supportEmail}`}
                passHref
                className="text-primary underline"
              >
                {supportEmail}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Social */}
      <Card className="bg-transparent border-none shadow-none ">
        <CardContent className="p-0 flex flex-col items-center">
          <h3 className="text-sm font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-muted-foreground">
            <Link href="https://instagram.com" target="_blank">
              <Instagram size={20} />
            </Link>
            <Link href="https://twitter.com" target="_blank">
              <Twitter size={20} />
            </Link>
            <Link href="https://facebook.com" target="_blank">
              <Facebook size={20} />
            </Link>
            <Link href="https://www.youtube.com/@DripRats" target="_blank">
              <Youtube size={20} />
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="border-t mt-10 pt-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Driprats. All rights reserved.
      </div>
    </footer>
  );
}
