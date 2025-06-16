import cloudinaryLoader from "@/lib/cloudinaryUtils";
import { Metadata } from "next";
import ProductDetails from "./ProductDetails";

type Props = {
  params: Promise<{ id: string; category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, category } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;
  try {
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        title: "Product Not Found",
      };
    }

    const {
      body: { data: product },
    } = await response.json();
    const productUrl = `${baseUrl}/shop/${category}/${id}`;

    const title = product?.Name || "Driprats";
    const description =
      product?.Description || "Discover exclusive jewelry at Driprats.";
    const imageUrl = product?.ImageUrls?.[0];

    const structuredData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.Name,
      image: [cloudinaryLoader({ src: imageUrl, width: 1200 })],
      description: product.Description,
      sku: product.ProductId,
      brand: {
        "@type": "Brand",
        name: "Driprats",
      },
      offers: {
        "@type": "Offer",
        url: productUrl,
        priceCurrency: "INR",
        price: product.Price,
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
      },
    };

    return {
      title: title,
      description: description,
      alternates: {
        canonical: productUrl,
      },
      openGraph: {
        title: title,
        description: description,
        url: productUrl,
        siteName: "Driprats",
        type: "website",
        images: [
          {
            url: cloudinaryLoader({ src: imageUrl, width: 1200 }),
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: [cloudinaryLoader({ src: imageUrl, width: 1200 })],
      },
      metadataBase: new URL(baseUrl),
      other: {
        "application/ld+json": JSON.stringify(structuredData),
      },
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Product",
      description: "Explore our products.",
    };
  }
}

export default function ProductDetailPage() {
  return <ProductDetails />;
}
