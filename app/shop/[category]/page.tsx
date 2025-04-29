import { Metadata } from "next";
import CategoryPage from "./CategoryPage";

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.category);

  return {
    title: `${categoryName} | Driprats`,
    description: `Explore ${categoryName} jewelry collections crafted for futuristic luxury.`,
    openGraph: {
      title: `${categoryName} | Driprats`,
      description: `Explore ${categoryName} jewelry collections crafted for futuristic luxury.`,
      url: `https://driprats.com/shop/${categoryName}`,
      images: [
        {
          url: `https://driprats.com/og-collections/${categoryName}.jpg`, // your collection OG images folder //TODO
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
      images: [`https://driprats.com/og-collections/${categoryName}.jpg`],
    },
  };
}

export default function ProductsPage() {
  return <CategoryPage />;
}
