import { Metadata } from "next";
import ProductDetails from "./ProductDetails";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
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
        images: [
          {
            url: product?.ImageUrls?.[0], // fallback if no image
            width: 1200,
            height: 630,
          },
        ],
        url: `${baseUrl}/shop/Rings/${id}`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product?.Name,
        description: product?.Description,
        images: [product?.ImageUrls?.[0]],
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
