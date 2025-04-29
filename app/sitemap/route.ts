// app/sitemap/route.ts
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const searchIndexRef = collection(db, "SearchIndex");
  const snapshot = await getDocs(searchIndexRef);

  const products = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: data.ProductId,
      category: data.Category,
    };
  });

  const categories = [...new Set(products.map((p) => p.category))];

  const staticPages = ["", "/shop"];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages
      .map(
        (page) => `
      <url>
        <loc>${baseUrl}${page}</loc>
        <priority>1.0</priority>
      </url>
    `
      )
      .join("")}

    ${categories
      .map(
        (category) => `
      <url>
        <loc>${baseUrl}/shop/${category}</loc>
        <priority>0.8</priority>
      </url>
    `
      )
      .join("")}

    ${products
      .map(
        (product) => `
      <url>
        <loc>${baseUrl}/shop/${product.category}/${product.id}</loc>
        <priority>0.7</priority>
      </url>
    `
      )
      .join("")}
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
