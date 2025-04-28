import { Metadata } from "next";
import ProductDetails from "./ProductDetails";

export async function generateMetadata(props: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const id = (await props.params).id;
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
