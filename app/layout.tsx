import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { Toaster } from "sonner";
import Breadcrumbs from "./components/common/BreadCrumbs";
import Navbar from "./components/common/NavBar";
import AuthGuard from "./components/common/ProtectedRoutes";
import "./globals.css";
import Providers from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drip Rats",
  description: "The only store for fashion Jewellery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdn.razorpay.com/widgets/affordability/affordability.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<>Loading...</>}>
          <Providers>
            <Navbar />
            <AuthGuard>
              <div className="m-3 md:mx-6 md:my-4">
                <Breadcrumbs />
              </div>
              <div> {children}</div>
              <Toaster position="bottom-right" richColors />{" "}
            </AuthGuard>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
