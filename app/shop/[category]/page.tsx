import { Metadata } from "next";
import CategoryPage from "./CategoryPage";

type Props = {
  params: Promise<{ id: string; category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categoryName } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  return {
    title: `${categoryName} | Driprats`,
    description: `Explore ${categoryName} jewelry collections crafted for futuristic luxury.`,
    openGraph: {
      title: `${categoryName} | Driprats`,
      description: `Explore ${categoryName} jewelry collections crafted for futuristic luxury.`,
      url: `${baseUrl}/shop/${categoryName}`,
      images: [
        {
          url: `${baseUrl}/og-collections/${categoryName}.jpg`, // your collection OG images folder //TODO
          width: 1200,
          height: 630,
          alt: `${categoryName} Collection`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryName} | Driprats`,
      description: `Explore ${categoryName} jewelry collections crafted for futuristic luxury.`,
      images: [`${baseUrl}/og-collections/${categoryName}.jpg`],
    },
  };
}

export default function ProductsPage() {
  return <CategoryPage />;
}
