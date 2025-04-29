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

    return {
      title: product?.Name,
      description: product?.Description,
      openGraph: {
        title: product?.Name,
        description: product?.Description,
        url: `${baseUrl}/shop/${category}/${id}`,
        type: "website",
        siteName: "Driprats",
        images: product?.ImageUrls?.[0]
          ? [
              {
                url: product.ImageUrls[0],
                width: 1200,
                height: 630,
                alt: "Product image",
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: product?.Name,
        description: product?.Description,
        images: product?.ImageUrls?.[0] ? [product.ImageUrls[0]] : [],
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
